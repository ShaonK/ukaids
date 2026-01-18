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

    const newPkg = await prisma.package.findUnique({
      where: { id: Number(packageId) },
    });

    if (!newPkg || !newPkg.isActive) {
      return NextResponse.json(
        { error: "Package not available" },
        { status: 404 }
      );
    }

    const newAmount = Number(newPkg.amount);

    // -------------------------------
    // TRANSACTION (SHORT & SAFE)
    // -------------------------------
    const result = await prisma.$transaction(async (tx) => {
      await ensureUserActive(tx, userId);

      const wallet = await tx.wallet.findUnique({
        where: { userId },
      });

      if (!wallet || Number(wallet.mainWallet) < newAmount) {
        throw new Error("Insufficient balance");
      }

      const activePkg = await tx.userPackage.findFirst({
        where: { userId, isActive: true },
        orderBy: { startedAt: "desc" },
      });

      // 🔻 Update wallet balances ONLY
      await tx.wallet.update({
        where: { userId },
        data: {
          mainWallet: { decrement: newAmount },
          returnWallet: activePkg
            ? { increment: activePkg.amount }
            : undefined,
        },
      });

      // 🔁 Deactivate old package
      if (activePkg) {
        await tx.userPackage.update({
          where: { id: activePkg.id },
          data: {
            isActive: false,
            endedAt: new Date(),
          },
        });
      }

      // ✅ Activate new package
      const newUserPkg = await tx.userPackage.create({
        data: {
          userId,
          packageId: newPkg.id,
          amount: newAmount,
          isActive: true,
          source: "upgrade",
          startedAt: new Date(),
        },
      });

      return {
        wallet,
        activePkg,
        newUserPkg,
      };
    });

    // -------------------------------
    // LEDGER LOGS (OUTSIDE TX)
    // -------------------------------
    const { wallet, activePkg } = result;

    // ACCOUNT debit log
    await prisma.walletTransaction.create({
      data: {
        userId,
        walletType: "ACCOUNT",
        direction: "DEBIT",
        amount: newAmount,
        balanceBefore: wallet.mainWallet,
        balanceAfter: wallet.mainWallet - newAmount,
        source: "PACKAGE_UPGRADE",
        note: `Upgrade to ${newPkg.name}`,
      },
    });

    // RETURN wallet credit log
    if (activePkg) {
      await prisma.walletTransaction.create({
        data: {
          userId,
          walletType: "RETURN",
          direction: "CREDIT",
          amount: activePkg.amount,
          balanceBefore: wallet.returnWallet,
          balanceAfter: wallet.returnWallet + activePkg.amount,
          source: "PACKAGE_UPGRADE_RETURN",
          referenceId: activePkg.id,
          note: "Previous package amount returned",
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Package upgraded successfully",
    });

  } catch (err) {
    console.error("PACKAGE UPGRADE ERROR:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
