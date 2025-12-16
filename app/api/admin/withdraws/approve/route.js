// app/api/admin/withdraws/approve/route.js
import prisma from "@/lib/prisma";
import { debitWallet } from "@/lib/walletService";

const COMMISSION_RATE = 0.10; // 10%

export async function POST(req) {
  try {
    const { id } = await req.json();
    const withdrawId = Number(id);

    if (!withdrawId) {
      return Response.json({ error: "Withdraw ID required" }, { status: 400 });
    }

    await prisma.$transaction(async (tx) => {
      const w = await tx.withdrawRequest.findUnique({
        where: { id: withdrawId },
      });

      if (!w) {
        throw new Error("Withdraw request not found");
      }

      if (w.status !== "pending") {
        throw new Error("Withdraw already processed");
      }

      const commission = Number((w.amount * COMMISSION_RATE).toFixed(6));
      const netAmount = Number((w.amount - commission).toFixed(6));

      // 🔒 Debit user ACCOUNT wallet
      await debitWallet({
        tx,
        userId: w.userId,
        walletType: "ACCOUNT",
        amount: w.amount,
        source: "WITHDRAW",
        referenceId: w.id,
        note: "Withdraw approved by admin",
      });

      // ✅ Update withdraw request
      await tx.withdrawRequest.update({
        where: { id: withdrawId },
        data: {
          commission,
          netAmount,
          status: "approved",
          approvedAt: new Date(),
        },
      });
    });

    return Response.json({
      success: true,
      message: "Withdraw approved successfully",
    });

  } catch (err) {
    console.error("ADMIN WITHDRAW APPROVE ERROR:", err);
    return Response.json(
      { error: err.message || "Approve failed" },
      { status: 500 }
    );
  }
}
