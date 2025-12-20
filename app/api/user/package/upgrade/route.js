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

    // -------------------------
    // 1️⃣ FETCH PACKAGE (NO TX)
    // -------------------------
    const newPackage = await prisma.package.findUnique({
      where: { id: Number(packageId) },
    });

    if (!newPackage || !newPackage.isActive) {
      return NextResponse.json(
        { error: "Invalid package" },
        { status: 400 }
      );
    }

    const upgradeAmount = Number(newPackage.amount);

    // -------------------------
    // 2️⃣ CHECK WALLET (NO TX)
    // -------------------------
    const wallet = await prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet || Number(wallet.mainWallet) < upgradeAmount) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      );
    }

    // -------------------------
    // 3️⃣ FAST TRANSACTION
    // -------------------------
    await prisma.$transaction(async (tx) => {
      await ensureUserActive(tx, userId);

      const activePkg = await tx.userPackage.findFirst({
        where: { userId, isActive: true },
      });

      // 🔁 deactivate previous package (if any)
      if (activePkg) {
        await tx.wallet.update({
          where: { userId },
          data: {
            returnWallet: {
              increment: Number(activePkg.amount),
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

      // 💰 debit & deposit
      await tx.wallet.update({
        where: { userId },
        data: {
          mainWallet: {
            decrement: upgradeAmount,
          },
          depositWallet: {
            increment: upgradeAmount,
          },
        },
      });

      // 📦 create new package
      await tx.userPackage.create({
        data: {
          userId,
          packageId: newPackage.id,
          amount: upgradeAmount,
          isActive: true,
          source: "self",
          totalEarned: 0,
          lastRoiAt: null,
          startedAt: new Date(),
        },
      });
    });

    // -------------------------
    // 4️⃣ REFERRAL COMMISSION (OUTSIDE TX ✅)
    // -------------------------
    await distributeReferralCommission({
      buyerId: userId,
      packageAmount: upgradeAmount,
      source: "PACKAGE_UPGRADE",
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
