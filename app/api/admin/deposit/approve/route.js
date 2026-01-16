import prisma from "@/lib/prisma";

const COMMISSION_RATE = 0.1;

export async function POST(req) {
  try {
    const { id } = await req.json();

    if (!id) {
      return Response.json(
        { error: "Withdraw request ID missing" },
        { status: 400 }
      );
    }

    await prisma.$transaction(async (tx) => {
      const w = await tx.withdrawRequest.findUnique({
        where: { id },
      });

      if (!w || w.status !== "pending") {
        throw new Error("Invalid withdraw request");
      }

      // 🔢 Calculate fee
      const commission = Number(
        (Number(w.amount) * COMMISSION_RATE).toFixed(6)
      );
      const netAmount = Number(
        (Number(w.amount) - commission).toFixed(6)
      );

      // 1️⃣ Update withdraw request
      await tx.withdrawRequest.update({
        where: { id },
        data: {
          commission,
          netAmount,
          status: "approved",
          approvedAt: new Date(),
        },
      });

      // 2️⃣ Approved withdraw snapshot (UI + reports)
      await tx.approvedWithdraw.create({
        data: {
          userId: w.userId,
          amount: netAmount,
          walletType: "ACCOUNT",
        },
      });

      // 3️⃣ Business history (for future reporting / audit)
      await tx.withdraw.create({
        data: {
          userId: w.userId,
          amount: netAmount,
          walletType: "ACCOUNT",
          status: "approved",
          approvedAt: new Date(),
        },
      });

      // ❌ NO wallet debit here
      // Balance was already deducted at request time
    });

    return Response.json({
      success: true,
      message: "Withdraw approved successfully",
    });

  } catch (err) {
    console.error("❌ WITHDRAW APPROVE ERROR:", err);
    return Response.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
