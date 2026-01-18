// app/api/user/task/status/route.js
import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";

// ---------- helpers ----------
function getDayInfo(timezone = "Asia/Dhaka") {
  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: timezone })
  );

  const dayShort = now.toLocaleDateString("en-US", {
    weekday: "short",
    timeZone: timezone,
  }); // Mon, Tue, Wed...

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

// ---------- API ----------
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

    // 🔹 ROI settings
    const settings = await prisma.roiSettings.findFirst();
    const roiDays = settings?.roiDays?.split(",") ?? [
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
    ];

    // ✅ FORCE Bangladesh timezone
    const timezone = settings?.timezone || "Asia/Dhaka";

    const { dayShort, todayMidnightMs, nextMidnightMs } =
      getDayInfo(timezone);

    // ❌ Off day (Sat / Sun)
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

    const lastRoiMs = activePkg.lastRoiAt
      ? new Date(activePkg.lastRoiAt).getTime()
      : null;

    // ✅ Ready if not completed today
    const isReady = !lastRoiMs || lastRoiMs < todayMidnightMs;
    const nextRunMs = isReady ? null : nextMidnightMs;

    const roiAmount = Number((activePkg.amount * 0.02).toFixed(6));

    return Response.json({
      success: true,
      earning: {
        isReady,
        nextRunMs,
        amount: roiAmount,
      },
    });
  } catch (err) {
    console.error("❌ TASK STATUS ERROR:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
