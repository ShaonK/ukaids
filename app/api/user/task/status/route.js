import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";

function getTodayInfo(timezone) {
  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: timezone })
  );

  const dayShort = now.toLocaleDateString("en-US", {
    weekday: "short",
    timeZone: timezone,
  });

  const todayMidnight = new Date(now);
  todayMidnight.setHours(0, 0, 0, 0);

  const nextMidnight = new Date(todayMidnight);
  nextMidnight.setDate(nextMidnight.getDate() + 1);

  return {
    dayShort,
    todayMidnightMs: todayMidnight.getTime(),
    nextMidnightMs: nextMidnight.getTime(),
    nowMs: now.getTime(),
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
      "Mon", "Tue", "Wed", "Thu", "Fri",
    ];
    const timezone = settings?.timezone ?? "Asia/Dhaka";

    const {
      dayShort,
      todayMidnightMs,
      nextMidnightMs,
      nowMs,
    } = getTodayInfo(timezone);

    // ❌ Off day
    if (!roiDays.includes(dayShort)) {
      return Response.json({
        success: true,
        earning: {
          isReady: false,
          nextRunMs: nextMidnightMs,
          reason: "OFF_DAY",
        },
      });
    }

    // 🔑 IMPORTANT FIX: lastRoiAt → timezone aware
    const lastRoiLocalMs = activePkg.lastRoiAt
      ? new Date(
          new Date(activePkg.lastRoiAt).toLocaleString("en-US", {
            timeZone: timezone,
          })
        ).getTime()
      : null;

    // ✅ Ready only if not done today
    const isReady = !lastRoiLocalMs || lastRoiLocalMs < todayMidnightMs;

    return Response.json({
      success: true,
      earning: {
        isReady,
        nextRunMs: isReady ? null : nextMidnightMs,
        amount: Number((activePkg.amount * 0.02).toFixed(6)),
      },
    });
  } catch (err) {
    console.error("TASK STATUS ERROR:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
