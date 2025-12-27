// app/api/user/task/complete/route.js
import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";
import { creditWallet } from "@/lib/walletService";
import { distributeLevelIncome } from "@/lib/levelService";

// ---------- helpers ----------
function getDayInfo(timezone = "UTC") {
  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: timezone })
  );

  const dayShort = now.toLocaleDateString("en-US", {
    weekday: "short",
    timeZone: timezone,
  });

  const midnight = new Date(now);
  midnight.setHours(0, 0, 0, 0);

  return {
    dayShort,
    todayMidnightMs: midnight.getTime(),
  };
}

// ---------- API ----------
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

    // 🔹 Load ROI settings
    const settings = await prisma.roiSettings.findFirst();
    const roiDays = settings?.roiDays?.split(",") ?? [
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
    ];
    const timezone = settings?.timezone ?? "UTC";

    const { dayShort, todayMidnightMs } = getDayInfo(timezone);

    // ❌ Weekend block (API safety)
    if (!roiDays.includes(dayShort)) {
      return Response.json(
        { error: "Task not available today" },
        { status: 400 }
      );
    }

    const lastRoiMs = activePkg.lastRoiAt
      ? new Date(activePkg.lastRoiAt).getTime()
      : null;

    // ❌ Already completed today
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
      await creditWallet({
        tx,
        userId: user.id,
        walletType: "ROI",
        amount: roiAmount,
        source: "TASK_ROI",
        note: "Daily task ROI",
      });

      await tx.roiHistory.create({
        data: {
          userId: user.id,
          amount: roiAmount,
          earningId: null,
        },
      });

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
