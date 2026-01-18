import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";

const TIMEZONE = "Asia/Dhaka";

function getBDMidnight() {
  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: TIMEZONE })
  );
  const midnight = new Date(now);
  midnight.setHours(0, 0, 0, 0);
  return midnight.getTime();
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

    const todayBD = new Date().toLocaleDateString("en-US", {
      weekday: "short",
      timeZone: TIMEZONE,
    });

    if (!roiDays.includes(todayBD)) {
      return Response.json({
        success: true,
        earning: {
          isReady: false,
          reason: "OFF_DAY",
        },
      });
    }

    const todayMidnight = getBDMidnight();
    const lastRun = activePkg.lastRoiAt
      ? new Date(activePkg.lastRoiAt).getTime()
      : null;

    const isReady = !lastRun || lastRun < todayMidnight;
    const nextRunMs = isReady
      ? null
      : todayMidnight + 24 * 60 * 60 * 1000;

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
