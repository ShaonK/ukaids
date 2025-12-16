import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getUser } from "@/lib/getUser";
import { ensureUserActive } from "@/lib/updateUserActiveStatus";
import { distributeReferralCommission } from "@/lib/referralService";

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

    const newPackage = await prisma.package.findUnique({
      where: { id: Number(packageId) },
    });

    if (!newPackage || !newPackage.isActive) {
      return NextResponse.json(
        { error: "Invalid package" },
        { status: 400 }
      );
    }

    await prisma.$transaction(async (tx) => {
      // 1️⃣ Ensure user active
      await ensureUserActive(tx, userId);

      const wallet = await tx.wallet.findUnique({
        where: { userId },
      });

      if (!wallet || wallet.mainWallet < newPackage.amount) {
        throw new Error("Insufficient balance");
      }

      const activePkg = await tx.userPackage.findFirst({
        where: { userId, isActive: true },
      });

      // 2️⃣ Close old package + return deposit
      if (activePkg) {
        await tx.wallet.update({
          where: { userId },
          data: {
            returnWallet: {
              increment: activePkg.amount,
            },
          },
        });

        await tx.userPackage.update({
          where: { id: activePkg.id },
          data: {
            isActive: false,
            endedAt: new Date(),
          },
        });
      }

      // 3️⃣ ACCOUNT debit + DEPOSIT replace
      await tx.wallet.update({
        where: { userId },
        data: {
          mainWallet: {
            decrement: newPackage.amount,
          },
          depositWallet: newPackage.amount,
        },
      });

      // 4️⃣ Wallet history
      await tx.walletTransaction.create({
        data: {
          userId,
          walletType: "ACCOUNT",
          direction: "DEBIT",
          amount: newPackage.amount,
          balanceBefore: wallet.mainWallet,
          balanceAfter: wallet.mainWallet - newPackage.amount,
          source: "PACKAGE_UPGRADE",
          note: `Upgraded to ${newPackage.name}`,
        },
      });

      // 5️⃣ New active package
      await tx.userPackage.create({
        data: {
          userId,
          packageId: newPackage.id,
          amount: newPackage.amount,
          isActive: true,
          source: "self",
          totalEarned: 0,
          lastRoiAt: null,
          startedAt: new Date(),
        },
      });

      // 🔥 6️⃣ Referral commission (10 → 3 → 2)
      await distributeReferralCommission({
        tx,
        buyerId: userId,
        packageAmount: newPackage.amount,
        source: "PACKAGE_UPGRADE",
      });
    });

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("PACKAGE UPGRADE ERROR:", err);
    return NextResponse.json(
      { error: err.message || "Upgrade failed" },
      { status: 500 }
    );
  }
}
