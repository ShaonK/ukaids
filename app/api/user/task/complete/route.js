// app/api/user/task/complete/route.js
import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";
import { updateUserActiveStatus } from "@/lib/updateUserActiveStatus";
import { onRoiGenerated } from "@/lib/onRoiGenerated";
import { creditWallet } from "@/lib/walletService";

export async function POST() {
  try {
    const user = await getUser();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 0️⃣ User status check
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

    // 1️⃣ Load active package
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

    // 2️⃣ ROI timing validation
    const now = new Date();
    const lastRun = activePackage.lastRoiAt || activePackage.startedAt;
    const nextRun = new Date(lastRun.getTime() + 60 * 1000);

    if (now < nextRun) {
      return Response.json(
        { error: "ROI not ready yet" },
        { status: 429 }
      );
    }

    // 3️⃣ ROI calculation (PACKAGE BASED)
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

    const remaining = maxEarnable - prevTotal;
    const payout = Math.min(roiUnit, remaining);

    // 4️⃣ CREDIT ROI WALLET (AUDITED)
    await creditWallet({
      userId: user.id,
      walletType: "ROI",
      amount: payout,
      source: "TASK_ROI",
      note: `ROI from package ${activePackage.package.name}`,
    });

    // 5️⃣ Update package ROI progress
    await prisma.userPackage.update({
      where: { id: activePackage.id },
      data: {
        totalEarned: { increment: payout },
        lastRoiAt: now,
      },
    });

    // 6️⃣ ROI HISTORY (FIXED ✅)
    const roiHistory = await prisma.roiHistory.create({
      data: {
        userId: user.id,
        amount: payout,
        // ❌ earningId REMOVED
      },
    });

    // 7️⃣ LEVEL INCOME (UNCHANGED)
    await onRoiGenerated({
      roiUserId: user.id,
      roiAmount: payout,
      roiEventId: roiHistory.id,
      source: "task",
    });

    // 8️⃣ Update active status
    await updateUserActiveStatus(user.id);

    return Response.json({ success: true });

  } catch (err) {
    console.error("TASK COMPLETE ERROR:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
