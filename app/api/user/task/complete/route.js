// app/api/user/task/complete/route.js
import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";
import { updateUserActiveStatus } from "@/lib/updateUserActiveStatus";
import { onRoiGenerated } from "@/lib/onRoiGenerated";

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
    const roiHistory = await prisma.roiHistory.create({
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

    // --------------------------------------------------
    // 7) LEVEL INCOME (SHARED – INDUSTRY STANDARD)
    // --------------------------------------------------
    await onRoiGenerated({
      roiUserId: user.id,
      roiAmount: payout,
      roiEventId: roiHistory.id, // future-proof
      source: "task",
    });

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
