// app/api/user/task/status/route.js
import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";

function getTodayMidnightMs() {
  const d = new Date();
  d.setHours(0, 0, 0, 0); // today 00:00
  return d.getTime();
}

function getNextMidnightMs() {
  const d = new Date();
  d.setHours(24, 0, 0, 0); // next day 00:00
  return d.getTime();
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

    const now = Date.now();
    const todayMidnightMs = getTodayMidnightMs();
    const nextMidnightMs = getNextMidnightMs();

    const lastRoiMs = activePkg.lastRoiAt
      ? new Date(activePkg.lastRoiAt).getTime()
      : null;

    // ✅ READY RULE (permanent midnight system)
    // - never did task → ready
    // - did task before today → ready
    // - did task today → locked until next midnight
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
