import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";
import { Prisma } from "@prisma/client";

export async function POST(req) {
  try {
    const user = await getUser();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount, trxId } = await req.json();

    if (!amount || !trxId) {
      return Response.json(
        { error: "Amount and transaction ID required" },
        { status: 400 }
      );
    }

    // ✅ STRICT STRING VALIDATION
    const cleanAmount = amount.toString().trim();

    if (isNaN(cleanAmount) || Number(cleanAmount) <= 0) {
      return Response.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }

    // ✅ PRISMA DECIMAL (NO FLOAT LOSS)
    const decimalAmount = new Prisma.Decimal(cleanAmount);

    await prisma.deposit.create({
      data: {
        userId: user.id,
        amount: decimalAmount, // ✅ EXACT
        trxId: trxId.trim(),
        status: "pending",
      },
    });

    return Response.json({
      success: true,
      message: "Recharge request submitted",
    });

  } catch (err) {
    console.error("USER RECHARGE ERROR:", err);
    return Response.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
