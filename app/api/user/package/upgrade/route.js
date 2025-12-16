// app/api/user/package/upgrade/route.js
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getUser } from "@/lib/getUser";
import { ensureUserActive } from "@/lib/updateUserActiveStatus";

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
      // 1️⃣ Ensure user active (আগের ফিক্স অক্ষত)
      await ensureUserActive(tx, userId);

      // 2️⃣ Load wallet
      const wallet = await tx.wallet.findUnique({
        where: { userId },
      });

      if (!wallet || wallet.mainWallet < newPackage.amount) {
        throw new Error("Insufficient balance");
      }

      // 3️⃣ Load active package
      const activePkg = await tx.userPackage.findFirst({
        where: { userId, isActive: true },
      });

      // 4️⃣ পুরোনো package বন্ধ + deposit return
      if (activePkg) {
        await tx.wallet.update({
          where: { userId },
          data: {
            returnWallet: {
              increment: activePkg.amount, // ✅ old deposit → return wallet
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

      // 5️⃣ 🔥 একটাই wallet update (ACCOUNT debit + DEPOSIT replace)
      await tx.wallet.update({
        where: { userId },
        data: {
          mainWallet: {
            decrement: newPackage.amount,
          },
          depositWallet: newPackage.amount, // ✅ replace (NO increment)
        },
      });

      // 6️⃣ Wallet transaction (ACCOUNT history)
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

      // 7️⃣ New active package
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
