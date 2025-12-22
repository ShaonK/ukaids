// app/api/admin/deposit/approve/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    console.log("🚨 APPROVE API HIT");

    const body = await req.json();
    console.log("🧾 BODY =", body);

    // 🔥 accept both id and depositId
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

    // 🔐 TRANSACTION (wallet + history safe)
    await prisma.$transaction(async (tx) => {
      // 1️⃣ Approve deposit
      await tx.deposit.update({
        where: { id: deposit.id },
        data: { status: "approved" },
      });

      // 2️⃣ Credit wallet
      await tx.wallet.update({
        where: { userId: deposit.userId },
        data: {
          mainWallet: { increment: deposit.amount },
        },
      });

      // 3️⃣ Wallet history (🔥 THIS WAS MISSING)
      await tx.walletTransaction.create({
        data: {
          userId: deposit.userId,
          walletType: "MAIN",
          amount: deposit.amount,
          type: "CREDIT",
          source: "DEPOSIT_APPROVED",
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
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
