import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";
import { creditWallet } from "@/lib/walletService";
import { distributeLevelIncome } from "@/lib/levelService";

const TIMEZONE = "Asia/Dhaka";

// 🔹 helper: today midnight in BD
function getBDMidnight() {
  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: TIMEZONE })
  );
  const midnight = new Date(now);
  midnight.setHours(0, 0, 0, 0);
  return midnight.getTime();
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

    // 🔹 ROI settings
    const settings = await prisma.roiSettings.findFirst();
    const roiDays = settings?.roiDays?.split(",") ?? [
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
    ];

    const todayBD = new Date().toLocaleDateString("en-US", {
      weekday: "short",
      timeZone: TIMEZONE,
    });

    if (!roiDays.includes(todayBD)) {
      return Response.json(
        { error: "Task not available today" },
        { status: 400 }
      );
    }

    const todayMidnight = getBDMidnight();

    // ❌ already done today
    if (
      activePkg.lastRoiAt &&
      new Date(activePkg.lastRoiAt).getTime() >= todayMidnight
    ) {
      return Response.json(
        { error: "Task already completed today" },
        { status: 400 }
      );
    }

    const roiAmount = Number((activePkg.amount * 0.02).toFixed(6));

    // 🔥 atomic
    await prisma.$transaction(async (tx) => {
      await creditWallet({
        tx,
        userId: user.id,
        walletType: "ROI",
        amount: roiAmount,
        source: "TASK_ROI",
        note: "Daily task ROI",
      });

      await tx.userPackage.update({
        where: { id: activePkg.id },
        data: {
          lastRoiAt: new Date(),
          totalEarned: { increment: roiAmount },
        },
      });
    });

    await distributeLevelIncome({
      buyerId: user.id,
      roiAmount,
    });

    // 🔥 next run = NEXT BD MIDNIGHT
    const nextMidnight = todayMidnight + 24 * 60 * 60 * 1000;

    return Response.json({
      success: true,
      roi: roiAmount,
      nextRunMs: nextMidnight,
    });
  } catch (err) {
    console.error("❌ TASK COMPLETE ERROR:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
