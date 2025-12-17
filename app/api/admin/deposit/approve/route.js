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

    const deposit = await prisma.deposit.update({
      where: { id: Number(depositId) },
      data: { status: "approved" },
    });

    // optional: wallet update
    await prisma.wallet.update({
      where: { userId: deposit.userId },
      data: {
        mainWallet: { increment: deposit.amount },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Deposit approved",
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
