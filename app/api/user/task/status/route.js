// app/api/user/task/status/route.js
export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";

const INTERVAL_MS = 60 * 1000; // 🔧 DEV = 1 minute

export async function GET() {
  try {
    const user = await getUser();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 🔹 Active package
    const activePackage = await prisma.userPackage.findFirst({
      where: {
        userId: user.id,
        isActive: true,
      },
      orderBy: {
        startedAt: "desc",
      },
    });

    if (!activePackage) {
      return Response.json({
        success: true,
        hasEarning: false,
      });
    }

    const nowMs = Date.now();

    const lastRunMs = activePackage.lastRoiAt
      ? new Date(activePackage.lastRoiAt).getTime()
      : new Date(activePackage.startedAt).getTime();

    const nextRunMs = lastRunMs + INTERVAL_MS;
    const isReady = nowMs >= nextRunMs;

    return Response.json({
      success: true,
      hasEarning: true,
      earning: {
        isReady,
        nextRunMs,
        packageAmount: Number(activePackage.amount),
        roiPercent: 2,
        totalEarned: Number(activePackage.totalEarned),
      },
    });

  } catch (err) {
    console.error("TASK STATUS ERROR:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
