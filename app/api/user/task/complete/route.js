// app/api/user/task/complete/route.js
import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";
import { creditWallet } from "@/lib/walletService";
import { distributeLevelIncome } from "@/lib/levelService";

// ✅ PROD: 24 HOURS
const TASK_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function POST() {
  try {
    const user = await getUser();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;

    // 🔎 active package
    const activePkg = await prisma.userPackage.findFirst({
      where: { userId, isActive: true },
    });

    if (!activePkg) {
      return Response.json({ error: "No active package" }, { status: 400 });
    }

    const now = Date.now();
    const baseTime = activePkg.lastRoiAt
      ? new Date(activePkg.lastRoiAt).getTime()
      : new Date(activePkg.startedAt).getTime();

    // ⏳ 24h lock check
    if (now - baseTime < TASK_INTERVAL_MS) {
      return Response.json({ error: "Task not ready" }, { status: 400 });
    }

    const roiAmount = Number((activePkg.amount * 0.02).toFixed(6));

    // -------------------------
    // 1️⃣ FAST TRANSACTION
    // -------------------------
    await prisma.$transaction(async (tx) => {
      // ROI wallet credit
      await creditWallet({
        tx,
        userId,
        walletType: "ROI",
        amount: roiAmount,
        source: "TASK_ROI",
        note: "Task completed ROI",
      });

      // ROI history
      await tx.roiHistory.create({
        data: {
          userId,
          amount: roiAmount,
          earningId: null,
        },
      });

      // Update package
      await tx.userPackage.update({
        where: { id: activePkg.id },
        data: {
          lastRoiAt: new Date(),
          totalEarned: { increment: roiAmount },
        },
      });
    });

    // -------------------------
    // 2️⃣ LEVEL INCOME
    // -------------------------
    await distributeLevelIncome({
      buyerId: userId,
      roiAmount,
    });

    return Response.json({
      success: true,
      roi: roiAmount,
    });

  } catch (err) {
    console.error("❌ TASK COMPLETE ERROR:", err);
    return Response.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
