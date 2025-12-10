import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";

export async function POST() {
  try {
    const user = await getUser();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const now = new Date();

    const earning = await prisma.roiearning.findFirst({
      where: { userId: user.id, isActive: true, nextRun: { lte: now } }
    });

    if (!earning)
      return Response.json({ error: "No ROI ready to claim" }, { status: 400 });

    const payoutUnit = earning.amount;
    const prev = earning.totalEarned;
    const max = earning.maxEarnable;

    const remaining = max - prev;
    const payout = Math.min(payoutUnit, remaining);
    const overflow = payoutUnit - payout;

    await prisma.wallet.update({
      where: { userId: user.id },
      data: {
        roiWallet: { increment: payout },
        ...(overflow > 0 ? { returnWallet: { increment: overflow } } : {})
      }
    });

    await prisma.roiHistory.create({
      data: { userId: user.id, earningId: earning.id, amount: payout }
    });

    const nextRun = remaining <= payoutUnit
      ? earning.nextRun
      : new Date(Date.now() + 1 * 60 * 1000);

    await prisma.roiearning.update({
      where: { id: earning.id },
      data: {
        totalEarned: prev + payout,
        isActive: remaining > payoutUnit,
        nextRun
      }
    });

    return Response.json({ success: true, payout, nextRun });

  } catch (err) {
    console.error("TASK COMPLETE ERROR:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
