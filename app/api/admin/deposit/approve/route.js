import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { creditWallet } from "@/lib/walletService";

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

    await prisma.$transaction(async (tx) => {
      // 1️⃣ mark approved
      await tx.deposit.update({
        where: { id: deposit.id },
        data: { status: "approved" },
      });

      // 2️⃣ credit wallet SAFELY (NO precision loss)
      await creditWallet({
        tx,
        userId: deposit.userId,
        walletType: "ACCOUNT", // ✅ matches history API
        amount: deposit.amount, // ❌ NO Number()
        source: "DEPOSIT_APPROVED",
        referenceId: deposit.id,
        note: "Deposit approved by admin",
      });
    });

    return NextResponse.json({
      success: true,
      message: "Deposit approved successfully",
    });

  } catch (err) {
    console.error("❌ APPROVE ERROR:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
