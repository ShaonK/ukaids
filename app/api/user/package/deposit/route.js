import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";
import { debitWallet, creditWallet } from "@/lib/walletService";
import { ensureUserActive } from "@/lib/updateUserActiveStatus";
import { distributeReferralCommission } from "@/lib/referralService";

const INITIAL_ROI_PERCENT = 0.02;

export async function POST(req) {
  try {
    const user = await getUser();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { packageId } = await req.json();
    if (!packageId) {
      return Response.json(
        { error: "Package ID is required" },
        { status: 400 }
      );
    }

    const userId = user.id;

    const pkg = await prisma.package.findUnique({
      where: { id: Number(packageId) },
    });

    if (!pkg || !pkg.isActive) {
      return Response.json({ error: "Invalid package" }, { status: 400 });
    }

    const amount = Number(pkg.amount);

    await prisma.$transaction(async (tx) => {
      // 1️⃣ Ensure user active
      await ensureUserActive(tx, userId);

      const wallet = await tx.wallet.findUnique({
        where: { userId },
      });

      if (!wallet || wallet.mainWallet < amount) {
        throw new Error("Insufficient balance");
      }

      const activePkg = await tx.userPackage.findFirst({
        where: { userId, isActive: true },
      });

      if (activePkg) {
        throw new Error("Active package exists. Upgrade required.");
      }

      const initialRoi = Number((amount * INITIAL_ROI_PERCENT).toFixed(6));

      // 2️⃣ Debit ACCOUNT
      await debitWallet({
        tx,
        userId,
        walletType: "ACCOUNT",
        amount,
        source: "PACKAGE_BUY",
        note: `Package purchase (${pkg.name})`,
      });

      // 3️⃣ Credit DEPOSIT
      await creditWallet({
        tx,
        userId,
        walletType: "DEPOSIT",
        amount,
        source: "PACKAGE_BUY",
        note: `Package activated (${pkg.name})`,
      });

      // 4️⃣ Create active package
      await tx.userPackage.create({
        data: {
          userId,
          packageId: pkg.id,
          amount,
          isActive: true,
          source: "self",
          totalEarned: initialRoi,
          lastRoiAt: new Date(),
          startedAt: new Date(),
        },
      });

      // 5️⃣ Instant ROI
      await creditWallet({
        tx,
        userId,
        walletType: "ROI",
        amount: initialRoi,
        source: "INITIAL_ROI",
        note: `Initial ROI on ${pkg.name}`,
      });

      // 6️⃣ ROI history
      await tx.roiHistory.create({
        data: {
          userId,
          amount: initialRoi,
          earningId: null,
        },
      });

      // 🔥 7️⃣ REFERRAL COMMISSION (10 → 3 → 2)
      await distributeReferralCommission({
        tx,
        buyerId: userId,
        packageAmount: amount,
        source: "PACKAGE_BUY",
      });
    });

    return Response.json({
      success: true,
      message: "Package activated successfully",
    });

  } catch (err) {
    console.error("PACKAGE DEPOSIT ERROR:", err);
    return Response.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
