// app/api/user/task/complete/route.js
import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";

export async function POST(req) {
  try {
    const user = await getUser();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const now = new Date();

    // find a due roiEarning for this user
    const earning = await prisma.roiEarning.findFirst({
      where: {
        userId: user.id,
        isActive: true,
        nextRun: { lte: now },
      },
    });

    if (!earning) {
      return Response.json({ error: "No ROI ready to claim" }, { status: 400 });
    }

    // compute payout and overflow
    const payoutUnit = Number(earning.amount);
    const prevTotal = Number(earning.totalEarned || 0);
    const maxAllowed = Number(earning.maxEarnable || 0);

    const remainingAllowed = Math.max(0, maxAllowed - prevTotal);
    const payout = Math.min(payoutUnit, remainingAllowed);
    const overflow = Number((payoutUnit - payout).toFixed(6));

    // credit payout to roiWallet, overflow to returnWallet
    await prisma.wallet.update({
      where: { userId: user.id },
      data: {
        roiWallet: { increment: payout },
        ...(overflow > 0 ? { returnWallet: { increment: overflow } } : {}),
      },
    });

    // create roiHistory
    await prisma.roiHistory.create({
      data: {
        userId: user.id,
        earningId: earning.id,
        amount: payout,
      },
    });

    // update earning
    const newTotal = prevTotal + payout;
    const reachedCap = newTotal >= maxAllowed;

    const nextRun = reachedCap
      ? earning.nextRun // keep as-is (inactive)
      : new Date(Date.now() + 1 * 60 * 1000); // TEST: 1 minute

    await prisma.roiEarning.update({
      where: { id: earning.id },
      data: {
        totalEarned: newTotal,
        isActive: !reachedCap,
        nextRun,
      },
    });

    // (Optional) TODO: level income generation can be inserted here (per your Level rules).

    return Response.json({
      success: true,
      message: "Task completed — ROI credited",
      payout,
      overflow,
      nextRun,
      isActive: !reachedCap,
    });
  } catch (err) {
    console.error("TASK COMPLETE ERROR:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
