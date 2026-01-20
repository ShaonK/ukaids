import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";
import { creditWallet } from "@/lib/walletService";
import { distributeLevelIncome } from "@/lib/levelService";

// Bangladesh = UTC +6
function getBDMidnightUTC() {
  const now = new Date();

  const bdYear = now.getUTCFullYear();
  const bdMonth = now.getUTCMonth();
  const bdDate = now.getUTCDate();

  // BD midnight = UTC 18:00 (previous day)
  let bdMidnightUTC = Date.UTC(bdYear, bdMonth, bdDate, 18, 0, 0);

  // If current UTC time < 18:00, BD midnight was yesterday
  if (now.getUTCHours() < 18) {
    bdMidnightUTC -= 24 * 60 * 60 * 1000;
  }

  return bdMidnightUTC;
}

export async function POST() {
  try {
    // 🔐 Auth
    const user = await getUser();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 📦 Active package
    const activePkg = await prisma.userPackage.findFirst({
      where: { userId: user.id, isActive: true },
    });

    if (!activePkg) {
      return Response.json({ error: "No active package" }, { status: 400 });
    }

    // ⚙️ ROI settings
    const settings = await prisma.roiSettings.findFirst();
    const roiDays = settings?.roiDays?.split(",") ?? [
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
    ];

    // 📅 Today weekday in Bangladesh
    const todayBD = new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      timeZone: "Asia/Dhaka",
    }).format(new Date());

    if (!roiDays.includes(todayBD)) {
      return Response.json(
        { error: "Task not available today" },
        { status: 400 }
      );
    }

    const todayMidnight = getBDMidnightUTC();

    // ❌ Already completed today
    if (
      activePkg.lastRoiAt &&
      new Date(activePkg.lastRoiAt).getTime() >= todayMidnight
    ) {
      return Response.json(
        { error: "Task already completed today" },
        { status: 400 }
      );
    }

    // 💰 ROI calculation (2%)
    const roiAmount = Number((Number(activePkg.amount) * 0.02).toFixed(6));

    let roiHistoryRow = null;

    // 🔥 ATOMIC TRANSACTION
    await prisma.$transaction(async (tx) => {
      // 1️⃣ Credit ROI wallet
      await creditWallet({
        tx,
        userId: user.id,
        walletType: "ROI",
        amount: roiAmount,
        source: "TASK_ROI",
        note: "Daily task ROI",
      });

      // 2️⃣ Insert ROI history (🔥 REQUIRED FOR LIFETIME INCOME)
      roiHistoryRow = await tx.roiHistory.create({
        data: {
          userId: user.id,
          amount: roiAmount,
        },
      });

      // 3️⃣ Update active package stats
      await tx.userPackage.update({
        where: { id: activePkg.id },
        data: {
          lastRoiAt: new Date(), // UTC
          totalEarned: { increment: roiAmount },
        },
      });
    });

    // 🌐 Level income distribution (uses roiHistory if needed)
    await distributeLevelIncome({
      buyerId: user.id,
      roiAmount,
      roiHistoryId: roiHistoryRow?.id, // safe to pass
    });

    // ⏭️ Next run = next BD midnight
    const nextRunMs = todayMidnight + 24 * 60 * 60 * 1000;

    return Response.json({
      success: true,
      roi: roiAmount,
      nextRunMs,
    });
  } catch (err) {
    console.error("❌ TASK COMPLETE ERROR:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
