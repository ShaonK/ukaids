// app/api/admin/withdraws/reject/route.js
import prisma from "@/lib/prisma";
import { creditWallet } from "@/lib/walletService";

export async function POST(req) {
  try {
    const { id } = await req.json();

    await prisma.$transaction(async (tx) => {
      const w = await tx.withdrawRequest.findUnique({
        where: { id },
      });

      if (!w || w.status !== "pending") {
        throw new Error("Invalid withdraw request");
      }

      // 🔁 Return balance
      await creditWallet({
        tx,
        userId: w.userId,
        walletType: "ACCOUNT",
        amount: w.amount,
        source: "WITHDRAW_REJECT",
        referenceId: w.id,
        note: "Withdraw rejected, balance returned",
      });

      await tx.withdrawRequest.update({
        where: { id },
        data: {
          status: "rejected",
          rejectedAt: new Date(),
        },
      });
    });

    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
