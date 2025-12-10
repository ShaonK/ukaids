// app/api/user/task/complete/route.js
import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";

export async function POST() {
  try {
    const user = await getUser();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const now = new Date();

    const earning = await prisma.roiEarning.findFirst({
      where: { userId: user.id, isActive: true, nextRun: { lte: now } },
    });

    if (!earning)
      return Response.json({ error: "No ROI ready" }, { status: 400 });

    const payoutUnit = Number(earning.amount);
    const prevTotal = Number(earning.totalEarned);
    const maxAllowed = Number(earning.maxEarnable);

    const remainingAllowed = Math.max(0, maxAllowed - prevTotal);
    const payout = Math.min(payoutUnit, remainingAllowed);
    const overflow = payoutUnit - payout;

    await prisma.wallet.update({
      where: { userId: user.id },
      data: {
        roiWallet: { increment: payout },
        ...(overflow > 0 ? { returnWallet: { increment: overflow } } : {}),
      },
    });

    await prisma.roiHistory.create({
      data: {
        userId: user.id,
        earningId: earning.id,
        amount: payout,
      },
    });

    const updatedTotal = prevTotal + payout;
    const reachedCap = updatedTotal >= maxAllowed;

    await prisma.roiEarning.update({
      where: { id: earning.id },
      data: {
        totalEarned: updatedTotal,
        isActive: !reachedCap,
        nextRun: reachedCap
          ? earning.nextRun
          : new Date(Date.now() + 1 * 60 * 1000),
      },
    });

    return Response.json({
      success: true,
    });
  } catch (err) {
    console.error("TASK COMPLETE ERROR:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
