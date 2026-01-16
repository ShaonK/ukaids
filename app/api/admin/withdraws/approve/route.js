import prisma from "@/lib/prisma";
import { debitWallet } from "@/lib/walletService";

const COMMISSION_RATE = 0.1;

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

      const commission = Number((w.amount * COMMISSION_RATE).toFixed(6));
      const netAmount = Number((w.amount - commission).toFixed(6));

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

      // 2️⃣ KEEP existing behavior (do NOT break UI)
      await tx.approvedWithdraw.create({
        data: {
          userId: w.userId,
          amount: netAmount,
          walletType: "ACCOUNT",
        },
      });

      // 3️⃣ 🔥 NEW: create Withdraw record (business history)
      await tx.withdraw.create({
        data: {
          userId: w.userId,
          amount: netAmount,
          walletType: "ACCOUNT",
          status: "approved",
          approvedAt: new Date(),
        },
      });

      // 4️⃣ 🔥 NEW: debit wallet + ledger entry
      await debitWallet({
        tx,
        userId: w.userId,
        walletType: "ACCOUNT",
        amount: netAmount,
        source: "TRANSFER_OUT",
        referenceId: w.id,
        note: "Withdraw approved by admin",
      });
    });

    return Response.json({ success: true });

  } catch (err) {
    console.error("WITHDRAW APPROVE ERROR:", err);
    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
