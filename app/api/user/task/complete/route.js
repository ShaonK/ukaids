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

    // -------------------------
    // Distribute level income based on this payout (same percents)
    // SKIP inactive/blocked/suspended parents and continue upward until 6 eligible levels found
    // -------------------------
    async function distributeLevelIncomeSkipInactive(fromUserId, baseAmount, depositId) {
      const levelPercents = [0.05, 0.04, 0.04, 0.03, 0.02, 0.01];
      let levelIndex = 0;
      let currentUserId = fromUserId;

      while (levelIndex < levelPercents.length) {
        const child = await prisma.user.findUnique({
          where: { id: currentUserId },
          select: { referredBy: true },
        });

        const parentId = child?.referredBy ?? null;
        if (!parentId) break;

        const parent = await prisma.user.findUnique({
          where: { id: parentId },
          select: { id: true, isActive: true, isBlocked: true, isSuspended: true },
        });

        // move pointer up regardless
        currentUserId = parentId;

        // skip if parent not eligible
        if (!parent || !parent.isActive || parent.isBlocked || parent.isSuspended) {
          continue;
        }

        const percent = levelPercents[levelIndex];
        const commission = Number((baseAmount * percent).toFixed(6));
        if (commission > 0) {
          await prisma.wallet.update({
            where: { userId: parentId },
            data: { levelWallet: { increment: commission } },
          });

          await prisma.roiLevelIncome.create({
            data: {
              userId: parentId,
              fromUserId: fromUserId,
              level: levelIndex + 1,
              amount: commission,
            },
          });
        }

        levelIndex++;
      }
    }

    // call distribution for this payout
    await distributeLevelIncomeSkipInactive(user.id, payout, earning.depositId);

    return Response.json({
      success: true,
    });
  } catch (err) {
    console.error("TASK COMPLETE ERROR:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
