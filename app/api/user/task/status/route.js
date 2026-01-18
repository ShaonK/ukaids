import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";

// ✅ timezone-safe day info
function getDayInfo(timezone) {
  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: timezone })
  );

  const dayShort = now.toLocaleDateString("en-US", {
    weekday: "short",
    timeZone: timezone,
  });

  const midnight = new Date(now);
  midnight.setHours(0, 0, 0, 0);

  const nextMidnight = new Date(midnight);
  nextMidnight.setDate(nextMidnight.getDate() + 1);

  return {
    dayShort,
    todayMidnightMs: midnight.getTime(),
    nextMidnightMs: nextMidnight.getTime(),
  };
}

export async function GET() {
  try {
    const user = await getUser();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const activePkg = await prisma.userPackage.findFirst({
      where: { userId: user.id, isActive: true },
    });

    if (!activePkg) {
      return Response.json({ success: true, earning: null });
    }

    const settings = await prisma.roiSettings.findFirst();
    const roiDays = settings?.roiDays?.split(",") ?? [
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
    ];
    const timezone = settings?.timezone || "Asia/Dhaka";

    const {
      dayShort,
      todayMidnightMs,
      nextMidnightMs,
    } = getDayInfo(timezone);

    const roiAmount = Number((activePkg.amount * 0.02).toFixed(6));

    // ❌ OFF DAY
    if (!roiDays.includes(dayShort)) {
      return Response.json({
        success: true,
        earning: {
          isReady: false,
          reason: "OFF_DAY",
          nextRunMs: nextMidnightMs,
          amount: roiAmount,
        },
      });
    }

    const lastRoiMs = activePkg.lastRoiAt
      ? new Date(activePkg.lastRoiAt).getTime()
      : null;

    // ❌ Already completed today
    if (lastRoiMs && lastRoiMs >= todayMidnightMs) {
      return Response.json({
        success: true,
        earning: {
          isReady: false,
          reason: "COMPLETED",
          nextRunMs: nextMidnightMs,
          amount: roiAmount,
        },
      });
    }

    // ✅ READY
    return Response.json({
      success: true,
      earning: {
        isReady: true,
        reason: "READY",
        nextRunMs: null,
        amount: roiAmount,
      },
    });
  } catch (err) {
    console.error("TASK STATUS ERROR:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
