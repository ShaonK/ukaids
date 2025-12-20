import prisma from "@/lib/prisma";

const COMMISSION_RATE = 0.1;

export async function POST(req) {
  try {
    const { id } = await req.json();

    await prisma.$transaction(async (tx) => {
      const w = await tx.withdrawRequest.findUnique({ where: { id } });
      if (!w || w.status !== "pending") {
        throw new Error("Invalid withdraw request");
      }

      const commission = Number((w.amount * COMMISSION_RATE).toFixed(6));
      const netAmount = Number((w.amount - commission).toFixed(6));

      await tx.withdrawRequest.update({
        where: { id },
        data: {
          commission,
          netAmount,
          status: "approved",
          approvedAt: new Date(),
        },
      });

      await tx.approvedWithdraw.create({
        data: {
          userId: w.userId,
          amount: netAmount,
          walletType: "ACCOUNT",
        },
      });
    });

    return Response.json({ success: true });

  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
