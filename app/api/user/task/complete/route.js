// app/api/user/task/complete/route.js
import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";

export async function POST() {
  try {
    const user = await getUser();
    if (!user)
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    const now = new Date();

    // ----------------------------------------------
    // 1) Find active earning ready for payout
    // ----------------------------------------------
    const earning = await prisma.roiEarning.findFirst({
      where: { userId: user.id, isActive: true, nextRun: { lte: now } },
      orderBy: { id: "asc" },
    });

    if (!earning) {
      return Response.json({ error: "No ROI ready" }, { status: 400 });
    }

    // ----------------------------------------------
    // 2) ATOMIC LOCK SYSTEM (Prevents double payout)
    // ----------------------------------------------
    const lock = await prisma.roiEarning.updateMany({
      where: {
        id: earning.id,
        nextRun: earning.nextRun,         // ensure same (not already locked)
        totalEarned: earning.totalEarned, // ensure untouched
      },
      data: {
        nextRun: new Date(9999, 0, 1),     // temporarily lock
      },
    });

    // If lock fails → another request already processed payout
    if (lock.count === 0) {
      return Response.json(
        { error: "Task already processed. Please wait." },
        { status: 429 }
      );
    }

    // ----------------------------------------------
    // 3) Calculate payout
    // ----------------------------------------------
    const payoutUnit = Number(earning.amount);
    const prevTotal = Number(earning.totalEarned);
    const maxAllowed = Number(earning.maxEarnable);

    const remaining = Math.max(0, maxAllowed - prevTotal);
    const payout = Math.min(payoutUnit, remaining);
    const overflow = payoutUnit - payout;

    // ----------------------------------------------
    // 4) Update wallet
    // ----------------------------------------------
    await prisma.wallet.update({
      where: { userId: user.id },
      data: {
        roiWallet: { increment: payout },
        ...(overflow > 0 ? { returnWallet: { increment: overflow } } : {}),
      },
    });

    // ----------------------------------------------
    // 5) Add roi history row
    // ----------------------------------------------
    await prisma.roiHistory.create({
      data: {
        userId: user.id,
        earningId: earning.id,
        amount: payout,
      },
    });

    // ----------------------------------------------
    // 6) Update earning progress
    // ----------------------------------------------
    const updatedTotal = prevTotal + payout;
    const reachedCap = updatedTotal >= maxAllowed;

    const nextRunTime = reachedCap
      ? earning.nextRun
      : new Date(Date.now() + 1 * 60 * 1000);

    // restore nextRun (unlock)
    await prisma.roiEarning.update({
      where: { id: earning.id },
      data: {
        totalEarned: updatedTotal,
        isActive: !reachedCap,
        nextRun: nextRunTime,
        lastRunDate: new Date(),
      },
    });

    // ----------------------------------------------
    // 7) LEVEL INCOME — skip inactive parents
    // ----------------------------------------------
    async function distributeLevelIncome(fromUserId, baseAmount) {
      const LEVELS = [0.05, 0.04, 0.04, 0.03, 0.02, 0.01];
      let level = 0;
      let current = fromUserId;

      while (level < LEVELS.length) {
        const u = await prisma.user.findUnique({
          where: { id: current },
          select: { referredBy: true },
        });

        const parentId = u?.referredBy ?? null;
        if (!parentId) break;

        const parent = await prisma.user.findUnique({
          where: { id: parentId },
          select: {
            id: true,
            isActive: true,
            isBlocked: true,
            isSuspended: true,
          },
        });

        current = parentId;

        if (!parent || !parent.isActive || parent.isBlocked || parent.isSuspended) {
          continue; // skip inactive
        }

        const percent = LEVELS[level];
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
              level: level + 1,
              amount: commission,
            },
          });
        }

        level++;
      }
    }

    await distributeLevelIncome(user.id, payout);

    // ----------------------------------------------
    // 8) FINAL RESPONSE
    // ----------------------------------------------
    return Response.json({ success: true });

  } catch (err) {
    console.error("TASK COMPLETE LOCK ERROR:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
