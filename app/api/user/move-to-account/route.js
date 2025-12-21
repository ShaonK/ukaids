import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";

export async function POST() {
  try {
    const user = await getUser();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 🔒 User state check
    if (!user.isActive || user.isBlocked || user.isSuspended) {
      return Response.json(
        { error: "Account not eligible for wallet move" },
        { status: 403 }
      );
    }

    // 🔒 Active package required
    const activePackage = await prisma.userPackage.findFirst({
      where: {
        userId: user.id,
        isActive: true,
      },
    });

    if (!activePackage) {
      return Response.json(
        { error: "At least one active package required" },
        { status: 400 }
      );
    }

    // 🔍 Load wallet (NO TX)
    const wallet = await prisma.wallet.findUnique({
      where: { userId: user.id },
    });

    if (!wallet) {
      return Response.json({ error: "Wallet not found" }, { status: 404 });
    }

    const roiAmount = Number(wallet.roiWallet) || 0;
    const levelAmount = Number(wallet.levelWallet) || 0;
    const referralAmount = Number(wallet.referralWallet) || 0;
    const returnAmount = Number(wallet.returnWallet) || 0;

    const totalAmount =
      roiAmount + levelAmount + referralAmount + returnAmount;

    if (totalAmount <= 0) {
      return Response.json(
        { error: "No income balance to move" },
        { status: 400 }
      );
    }

    // 🔁 SINGLE ATOMIC TRANSACTION (NO HELPERS)
    await prisma.$transaction(async (tx) => {
      await tx.wallet.update({
        where: { userId: user.id },
        data: {
          // ➕ credit account
          mainWallet: {
            increment: totalAmount,
          },

          // ➖ reset income wallets
          roiWallet: 0,
          levelWallet: 0,
          referralWallet: 0,
          returnWallet: 0,
        },
      });

      // 🧾 history (optional but recommended)
      await tx.walletTransaction.create({
        data: {
          userId: user.id,
          walletType: "ACCOUNT",
          direction: "CREDIT",
          amount: totalAmount,
          balanceBefore: Number(wallet.mainWallet),
          balanceAfter: Number(wallet.mainWallet) + totalAmount,
          source: "WALLET_MOVE",
          note: "Income wallets moved to Account Balance",
        },
      });
    });

    return Response.json({
      success: true,
      movedAmount: totalAmount,
      message: "Income wallets successfully moved to Account Balance",
    });

  } catch (err) {
    console.error("WALLET MOVE ERROR:", err);
    return Response.json(
      { error: err.message || "Wallet move failed" },
      { status: 500 }
    );
  }
}
