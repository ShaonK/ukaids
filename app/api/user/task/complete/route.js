// app/api/user/task/complete/route.js
import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";
import { updateUserActiveStatus } from "@/lib/updateUserActiveStatus";

export async function POST() {
  try {
    const user = await getUser();
    if (!user)
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    const now = new Date();

    // 0) Inactive user cannot run ROI task
    const liveUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { isActive: true, isBlocked: true, isSuspended: true },
    });

    if (!liveUser.isActive || liveUser.isBlocked || liveUser.isSuspended) {
      return Response.json(
        { error: "Inactive account. No ROI allowed." },
        { status: 403 }
      );
    }

    // 1) Find earning ready for payout
    const earning = await prisma.roiEarning.findFirst({
      where: { userId: user.id, isActive: true, nextRun: { lte: now } },
      orderBy: { id: "asc" },
    });

    if (!earning) {
      return Response.json({ error: "No ROI ready" }, { status: 400 });
    }

    // 2) Lock earning to prevent duplicate
    const lock = await prisma.roiEarning.updateMany({
      where: {
        id: earning.id,
        nextRun: earning.nextRun,
        totalEarned: earning.totalEarned,
      },
      data: { nextRun: new Date(9999, 0, 1) },
    });

    if (lock.count === 0) {
      return Response.json(
        { error: "Task already processed. Wait…" },
        { status: 429 }
      );
    }

    // 3) Calculate payout
    const payoutUnit = Number(earning.amount);
    const prevTotal = Number(earning.totalEarned);
    const maxAllowed = Number(earning.maxEarnable);

    const remaining = Math.max(0, maxAllowed - prevTotal);
    const payout = Math.min(payoutUnit, remaining);
    const overflow = payoutUnit - payout;

    // 4) Update wallet
    await prisma.wallet.update({
      where: { userId: user.id },
      data: {
        roiWallet: { increment: payout },
        ...(overflow > 0 ? { returnWallet: { increment: overflow } } : {}),
      },
    });

    // 5) Add ROI history
    await prisma.roiHistory.create({
      data: {
        userId: user.id,
        earningId: earning.id,
        amount: payout,
      },
    });

    // 6) Update earning progress
    const updatedTotal = prevTotal + payout;
    const reachedCap = updatedTotal >= maxAllowed;

    const nextRunTime = reachedCap
      ? earning.nextRun
      : new Date(Date.now() + 1 * 60 * 1000);

    await prisma.roiEarning.update({
      where: { id: earning.id },
      data: {
        totalEarned: updatedTotal,
        isActive: !reachedCap,
        nextRun: nextRunTime,
        lastRunDate: new Date(),
      },
    });

    // *************************************************************
    // 7) NEW LEVEL INCOME LOGIC (BASED ON DIRECT REFERRAL COUNT)
    // *************************************************************

    // Get how many direct referrals this user has
    const directCount = await prisma.user.count({
      where: { referredBy: user.id }
    });

    // max levels allowed
    const LEVELS = [0.05, 0.04, 0.04, 0.03, 0.02];
    const allowedLevels = Math.min(directCount, 5); // user cannot unlock beyond his directs

    async function distributeLevelIncome(fromUserId, baseAmount) {
      if (allowedLevels === 0) return;

      let current = fromUserId;
      let level = 0;

      while (level < allowedLevels) {
        const u = await prisma.user.findUnique({
          where: { id: current },
          select: { referredBy: true },
        });

        const parentId = u?.referredBy ?? null;
        if (!parentId) break;

        // prevent self income (safety)
        if (parentId === fromUserId) break;

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
          level++; // skip but continue upward
          continue;
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
              fromUserId,
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
    // 8) Update user active status automatically
    // ----------------------------------------------
    await updateUserActiveStatus(user.id);

    return Response.json({ success: true });

  } catch (err) {
    console.error("TASK COMPLETE ERROR:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
