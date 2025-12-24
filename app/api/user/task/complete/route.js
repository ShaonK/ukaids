// app/api/user/task/complete/route.js
import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";
import { creditWallet } from "@/lib/walletService";
import { distributeLevelIncome } from "@/lib/levelService";

function getTodayMidnightMs() {
  const d = new Date();
  d.setHours(0, 0, 0, 0); // today 00:00
  return d.getTime();
}

export async function POST() {
  try {
    const user = await getUser();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const activePkg = await prisma.userPackage.findFirst({
      where: { userId: user.id, isActive: true },
    });

    if (!activePkg) {
      return Response.json({ error: "No active package" }, { status: 400 });
    }

    const todayMidnightMs = getTodayMidnightMs();
    const lastRoiMs = activePkg.lastRoiAt
      ? new Date(activePkg.lastRoiAt).getTime()
      : null;

    // ❌ BLOCK: already completed today
    if (lastRoiMs && lastRoiMs >= todayMidnightMs) {
      return Response.json(
        { error: "Task already completed today" },
        { status: 400 }
      );
    }

    const roiAmount = Number((activePkg.amount * 0.02).toFixed(6));

    // -------------------------
    // 1️⃣ FAST TRANSACTION
    // -------------------------
    await prisma.$transaction(async (tx) => {
      // ROI wallet credit
      await creditWallet({
        tx,
        userId: user.id,
        walletType: "ROI",
        amount: roiAmount,
        source: "TASK_ROI",
        note: "Daily task ROI",
      });

      // ROI history
      await tx.roiHistory.create({
        data: {
          userId: user.id,
          amount: roiAmount,
          earningId: null,
        },
      });

      // Update package (mark completed now)
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
      buyerId: user.id,
      roiAmount,
    });

    return Response.json({ success: true, roi: roiAmount });
  } catch (err) {
    console.error("❌ TASK COMPLETE ERROR:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
