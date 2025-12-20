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

    // -------------------------
    // 1️⃣ FETCH PACKAGE (NO TX)
    // -------------------------
    const pkg = await prisma.package.findUnique({
      where: { id: Number(packageId) },
    });

    if (!pkg || !pkg.isActive) {
      return Response.json({ error: "Invalid package" }, { status: 400 });
    }

    const amount = Number(pkg.amount);

    // -------------------------
    // 2️⃣ CHECK WALLET (NO TX)
    // -------------------------
    const wallet = await prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet || Number(wallet.mainWallet) < amount) {
      return Response.json(
        { error: "Insufficient balance" },
        { status: 400 }
      );
    }

    // -------------------------
    // 3️⃣ CHECK ACTIVE PACKAGE
    // -------------------------
    const activePkg = await prisma.userPackage.findFirst({
      where: { userId, isActive: true },
    });

    if (activePkg) {
      return Response.json(
        { error: "Active package exists. Upgrade required." },
        { status: 400 }
      );
    }

    const initialRoi = Number(
      (amount * INITIAL_ROI_PERCENT).toFixed(6)
    );

    // -------------------------
    // 4️⃣ FAST TRANSACTION (ONLY WRITES)
    // -------------------------
    await prisma.$transaction(async (tx) => {
      await ensureUserActive(tx, userId);

      await debitWallet({
        tx,
        userId,
        walletType: "ACCOUNT",
        amount,
        source: "PACKAGE_BUY",
        note: `Package purchase (${pkg.name})`,
      });

      await creditWallet({
        tx,
        userId,
        walletType: "DEPOSIT",
        amount,
        source: "PACKAGE_BUY",
        note: `Package activated (${pkg.name})`,
      });

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

      await creditWallet({
        tx,
        userId,
        walletType: "ROI",
        amount: initialRoi,
        source: "INITIAL_ROI",
        note: `Initial ROI on ${pkg.name}`,
      });

      await tx.roiHistory.create({
        data: {
          userId,
          amount: initialRoi,
          earningId: null,
        },
      });
    });

    // -------------------------
    // 5️⃣ REFERRAL COMMISSION (OUTSIDE TX ✅)
    // -------------------------
    await distributeReferralCommission({
      buyerId: userId,
      packageAmount: amount,
      source: "PACKAGE_BUY",
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
