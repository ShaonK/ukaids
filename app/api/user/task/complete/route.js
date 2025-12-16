// app/api/user/task/complete/route.js
import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";
import { creditWallet } from "@/lib/walletService";

const TASK_INTERVAL_MS = 60 * 1000; // DEV MODE (1 min)

export async function POST() {
  try {
    const user = await getUser();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;

    // 🔎 Load active package
    const activePkg = await prisma.userPackage.findFirst({
      where: {
        userId,
        isActive: true,
      },
    });

    if (!activePkg) {
      return Response.json(
        { error: "No active package" },
        { status: 400 }
      );
    }

    const now = Date.now();

    // ⏱ Cooldown base
    const baseTime = activePkg.lastRoiAt
      ? new Date(activePkg.lastRoiAt).getTime()
      : new Date(activePkg.startedAt).getTime();

    const isReady = now - baseTime >= TASK_INTERVAL_MS;

    // 🔐 Double click guard
    if (!isReady) {
      return Response.json(
        { error: "Task not ready" },
        { status: 400 }
      );
    }

    const roiAmount = Number(
      (activePkg.amount * 0.02).toFixed(6)
    );

    await prisma.$transaction(async (tx) => {
      // 1️⃣ Credit ROI wallet
      await creditWallet({
        userId,
        walletType: "ROI",
        amount: roiAmount,
        source: "TASK_ROI",
        note: "Task completed ROI",
      });

      // 2️⃣ 🔥 SAVE ROI HISTORY (THIS WAS MISSING)
      await tx.roiHistory.create({
        data: {
          userId,
          amount: roiAmount,
          earningId: null, // optional, future-safe
        },
      });

      // 3️⃣ Update package task context
      await tx.userPackage.update({
        where: { id: activePkg.id },
        data: {
          lastRoiAt: new Date(),
          totalEarned: {
            increment: roiAmount,
          },
        },
      });
    });

    return Response.json({
      success: true,
      roi: roiAmount,
    });

  } catch (err) {
    console.error("❌ TASK COMPLETE ERROR:", err);
    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
