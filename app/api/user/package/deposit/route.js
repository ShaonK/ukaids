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
      return NextResponse.json({ error: "Package ID missing" }, { status: 400 });
    }

    const userId = user.id;

    // 1️⃣ Fetch package
    const pkg = await prisma.package.findUnique({
      where: { id: Number(packageId) },
    });

    if (!pkg || !pkg.isActive) {
      return NextResponse.json(
        { error: "Package not active yet" },
        { status: 403 }
      );
    }

    const amount = Number(pkg.amount);

    // 2️⃣ Wallet check
    const wallet = await prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet || Number(wallet.mainWallet) < amount) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      );
    }

    // 3️⃣ Ensure no active package
    const activePkg = await prisma.userPackage.findFirst({
      where: { userId, isActive: true },
    });

    if (activePkg) {
      return NextResponse.json(
        { error: "Active package exists. Upgrade required." },
        { status: 400 }
      );
    }

    // 4️⃣ Transaction
    await prisma.$transaction(async (tx) => {
      await ensureUserActive(tx, userId);

      await tx.wallet.update({
        where: { userId },
        data: {
          mainWallet: { decrement: amount },
          depositWallet: amount,
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
