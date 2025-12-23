// app/api/admin/deposit/approve/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const body = await req.json();

    const depositId = body.depositId ?? body.id;
    if (!depositId) {
      return NextResponse.json(
        { error: "Deposit ID missing" },
        { status: 400 }
      );
    }

    // 🔎 Load deposit
    const deposit = await prisma.deposit.findUnique({
      where: { id: Number(depositId) },
    });

    if (!deposit) {
      return NextResponse.json(
        { error: "Deposit not found" },
        { status: 404 }
      );
    }

    if (deposit.status === "approved") {
      return NextResponse.json(
        { error: "Deposit already approved" },
        { status: 400 }
      );
    }

    // 🔐 TRANSACTION
    await prisma.$transaction(async (tx) => {
      // 1️⃣ Load wallet
      const wallet = await tx.wallet.findUnique({
        where: { userId: deposit.userId },
      });

      if (!wallet) {
        throw new Error("Wallet not found for user");
      }

      const balanceBefore = wallet.mainWallet;
      const balanceAfter = balanceBefore.plus(deposit.amount);

      // 2️⃣ Approve deposit
      await tx.deposit.update({
        where: { id: deposit.id },
        data: { status: "approved" },
      });

      // 3️⃣ Update wallet balance
      await tx.wallet.update({
        where: { userId: deposit.userId },
        data: {
          mainWallet: { increment: deposit.amount },
        },
      });

      // 4️⃣ Wallet history (✅ schema-correct)
      await tx.walletTransaction.create({
        data: {
          userId: deposit.userId,
          walletType: "MAIN",
          direction: "CREDIT",
          amount: deposit.amount,
          balanceBefore,
          balanceAfter,
          source: "DEPOSIT_APPROVED",
          referenceId: deposit.id,
          note: "Deposit approved by admin",
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: "Deposit approved successfully",
      id: depositId,
    });

  } catch (err) {
    console.error("❌ APPROVE ERROR:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
