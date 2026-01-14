import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getUser } from "@/lib/getUser";
import { ensureUserActive } from "@/lib/updateUserActiveStatus";
import { distributeReferralCommission } from "@/lib/referralService";

const BUY_LIMIT = 500;

export async function POST(req) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { packageId } = await req.json();
    if (!packageId) {
      return NextResponse.json(
        { error: "Package ID missing" },
        { status: 400 }
      );
    }

    const userId = user.id;

    const pkg = await prisma.package.findUnique({
      where: { id: Number(packageId) },
    });

    if (!pkg) {
      return NextResponse.json(
        { error: "Package not found" },
        { status: 404 }
      );
    }

    if (Number(pkg.amount) > BUY_LIMIT) {
      return NextResponse.json(
        { error: "This package is upgrade-only" },
        { status: 403 }
      );
    }

    if (!pkg.isActive) {
      return NextResponse.json(
        { error: "Package not active yet" },
        { status: 403 }
      );
    }

    const amount = Number(pkg.amount);

    await prisma.$transaction(async (tx) => {
      await ensureUserActive(tx, userId);

      const wallet = await tx.wallet.findUnique({
        where: { userId },
      });

      if (!wallet || Number(wallet.mainWallet) < amount) {
        throw new Error("Insufficient balance");
      }

      const accBefore = wallet.mainWallet;
      const accAfter = accBefore.minus(amount);

      // 🔻 ACCOUNT DEBIT
      await tx.wallet.update({
        where: { userId },
        data: {
          mainWallet: { decrement: amount },
          depositWallet: { increment: amount },
        },
      });

      // ✅ ACCOUNT HISTORY
      await tx.walletTransaction.create({
        data: {
          userId,
          walletType: "ACCOUNT",
          direction: "DEBIT",
          amount,
          balanceBefore: accBefore,
          balanceAfter: accAfter,
          source: "PACKAGE_BUY",
          note: `Package purchased (${pkg.name})`,
        },
      });

      // ✅ DEPOSIT HISTORY
      await tx.walletTransaction.create({
        data: {
          userId,
          walletType: "DEPOSIT",
          direction: "CREDIT",
          amount,
          balanceBefore: wallet.depositWallet,
          balanceAfter: wallet.depositWallet.plus(amount),
          source: "PACKAGE_BUY",
          note: `Package activated (${pkg.name})`,
        },
      });

      await tx.userPackage.create({
        data: {
          userId,
          packageId: pkg.id,
          amount,
          isActive: true,
          source: "self",
          startedAt: new Date(),
        },
      });
    });

    await distributeReferralCommission({
      buyerId: userId,
      packageAmount: amount,
      source: "PACKAGE_BUY",
    });

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("PACKAGE BUY ERROR:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
