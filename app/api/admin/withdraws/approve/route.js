import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const { id } = await req.json();

    const withdraw = await prisma.withdraw.findUnique({ where: { id } });
    if (!withdraw) return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });

    if (withdraw.status !== "pending") {
      return new Response(JSON.stringify({ error: "Already processed" }), { status: 400 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.withdraw.update({
        where: { id },
        data: { status: "approved" }
      });

      await tx.approvedWithdraw.create({
        data: {
          userId: withdraw.userId,
          amount: withdraw.amount,
          walletType: withdraw.walletType
        }
      });

      // deduct wallet
      await tx.wallet.update({
        where: { userId: withdraw.userId },
        data: {
          mainWallet: { decrement: withdraw.amount }
        }
      });
    });

    return new Response(JSON.stringify({ success: true }));
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
