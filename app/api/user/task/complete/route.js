// app/api/user/task/complete/route.js
export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";
import { creditWallet } from "@/lib/walletService";
import { onRoiGenerated } from "@/lib/onRoiGenerated";
import { updateUserActiveStatus } from "@/lib/updateUserActiveStatus";

const INTERVAL_MS = 60 * 1000; // 🔧 DEV = 1 minute

export async function POST() {
  try {
    const user = await getUser();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 🔹 User status check
    const liveUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        isActive: true,
        isBlocked: true,
        isSuspended: true,
      },
    });

    if (!liveUser.isActive || liveUser.isBlocked || liveUser.isSuspended) {
      return Response.json(
        { error: "Inactive account" },
        { status: 403 }
      );
    }

    // 🔹 Active package
    const activePackage = await prisma.userPackage.findFirst({
      where: {
        userId: user.id,
        isActive: true,
      },
      include: {
        package: true,
      },
      orderBy: {
        startedAt: "desc",
      },
    });

    if (!activePackage) {
      return Response.json(
        { error: "No active package" },
        { status: 400 }
      );
    }

    const nowMs = Date.now();

    const lastRunMs = activePackage.lastRoiAt
      ? new Date(activePackage.lastRoiAt).getTime()
      : new Date(activePackage.startedAt).getTime();

    const nextRunMs = lastRunMs + INTERVAL_MS;

    // 🔒 Cooldown check
    if (nowMs < nextRunMs) {
      return Response.json(
        { error: "Task not ready yet" },
        { status: 429 }
      );
    }

    // 🔹 ROI calculation (PACKAGE BASED)
    const roiPercent = 0.02;
    const roiUnit = Number((activePackage.amount * roiPercent).toFixed(6));

    const maxEarnable = Number((activePackage.amount * 2).toFixed(6));
    const prevTotal = Number(activePackage.totalEarned);

    if (prevTotal >= maxEarnable) {
      return Response.json(
        { error: "ROI cap reached" },
        { status: 400 }
      );
    }

    const payout = Math.min(roiUnit, maxEarnable - prevTotal);

    // 🔹 Credit ROI wallet
    await creditWallet({
      userId: user.id,
      walletType: "ROI",
      amount: payout,
      source: "TASK_ROI",
      note: `ROI from package ${activePackage.package.name}`,
    });

    // 🔹 Update package progress & timer
    await prisma.userPackage.update({
      where: { id: activePackage.id },
      data: {
        totalEarned: { increment: payout },
        lastRoiAt: new Date(nowMs), // 🔥 ONLY TIMER SOURCE
      },
    });

    // 🔹 ROI history
    const roiHistory = await prisma.roiHistory.create({
      data: {
        userId: user.id,
        amount: payout,
      },
    });

    // 🔹 Level income
    await onRoiGenerated({
      roiUserId: user.id,
      roiAmount: payout,
      roiEventId: roiHistory.id,
      source: "task",
    });

    await updateUserActiveStatus(user.id);

    return Response.json({ success: true });

  } catch (err) {
    console.error("TASK COMPLETE ERROR:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
