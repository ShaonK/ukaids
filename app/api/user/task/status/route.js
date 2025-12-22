// app/api/user/task/status/route.js
import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";

// ✅ PROD: 24 HOURS
const TASK_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function GET() {
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
      return Response.json({
        success: true,
        earning: null,
      });
    }

    const now = Date.now();

    const baseTime = activePkg.lastRoiAt
      ? new Date(activePkg.lastRoiAt).getTime()
      : new Date(activePkg.startedAt).getTime();

    const isReady = now - baseTime >= TASK_INTERVAL_MS;

    const nextRunMs = isReady
      ? null
      : baseTime + TASK_INTERVAL_MS;

    const roiAmount = Number(
      (activePkg.amount * 0.02).toFixed(6)
    );

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
    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
