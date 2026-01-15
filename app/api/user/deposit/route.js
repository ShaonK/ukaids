import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";
import { debitWallet, creditWallet } from "@/lib/walletService";
import { ensureUserActive } from "@/lib/updateUserActiveStatus";
import { distributeReferralCommission } from "@/lib/referralService";

const INITIAL_ROI_PERCENT = 0.02;
const BUY_LIMIT = 500;

export async function POST(req) {
  try {
    const user = await getUser();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { packageId } = await req.json();
    if (!packageId) {
      return Response.json({ error: "Package ID is required" }, { status: 400 });
    }

    const userId = user.id;

    const pkg = await prisma.package.findUnique({
      where: { id: Number(packageId) },
    });

    if (!pkg || !pkg.isActive) {
      return Response.json({ error: "Invalid package" }, { status: 400 });
    }

    if (Number(pkg.amount) > BUY_LIMIT) {
      return Response.json(
        { error: "This package is upgrade-only" },
        { status: 403 }
      );
    }

    const amount = Number(pkg.amount);

    await prisma.$transaction(async (tx) => {
      await ensureUserActive(tx, userId);

      const wallet = await tx.wallet.findUnique({ where: { userId } });
      if (!wallet || Number(wallet.mainWallet) < amount) {
        throw new Error("Insufficient balance");
      }

      const initialRoi = Number((amount * INITIAL_ROI_PERCENT).toFixed(6));

      // 🔻 ACCOUNT
      await debitWallet({
        tx,
        userId,
        walletType: "ACCOUNT",
        amount,
        source: "PACKAGE_BUY",
      });

      // 🔺 DEPOSIT WALLET
      await creditWallet({
        tx,
        userId,
        walletType: "DEPOSIT",
        amount,
        source: "PACKAGE_BUY",
      });

      // ✅ CREATE DEPOSIT
      const deposit = await tx.deposit.create({
        data: {
          userId,
          amount,
          trxId: `PKG-${Date.now()}`,
          status: "approved",
        },
      });

      // ✅ DEPOSIT HISTORY
      await tx.depositHistory.create({
        data: {
          userId,
          depositId: deposit.id,
          amount,
          trxId: deposit.trxId,
          status: "approved",
          processedBy: 1, // system/admin
        },
      });

      // 📦 USER PACKAGE
      await tx.userPackage.create({
        data: {
          userId,
          packageId: pkg.id,
          amount,
          isActive: true,
          source: "self",
          totalEarned: initialRoi,
          lastRoiAt: new Date(),
        },
      });

      // 💰 INITIAL ROI
      await creditWallet({
        tx,
        userId,
        walletType: "ROI",
        amount: initialRoi,
        source: "INITIAL_ROI",
      });

      await tx.roiHistory.create({
        data: {
          userId,
          amount: initialRoi,
        },
      });

      await distributeReferralCommission({
        tx,
        buyerId: userId,
        packageAmount: amount,
        source: "PACKAGE_BUY",
      });
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error("PACKAGE BUY ERROR:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
