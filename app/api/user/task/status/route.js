// app/api/user/task/status/route.js
import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";

export async function GET() {
  try {
    const user = await getUser();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1️⃣ Active package fetch (LATEST)
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
        isReady: false,
      });
    }

    // 2️⃣ ROI timing (every 1 minute – same as before)
    const now = new Date();
    const lastRun = activePackage.lastRoiAt || activePackage.startedAt;
    const nextRun = new Date(lastRun.getTime() + 60 * 1000);

    const isReady = now >= nextRun;

    return Response.json({
      success: true,
      hasEarning: true,
      earning: {
        packageId: activePackage.packageId,
        packageAmount: Number(activePackage.amount),
        roiPercent: 2,
        nextRun,
        isReady,
        totalEarned: Number(activePackage.totalEarned),
      },
    });

  } catch (err) {
    console.error("TASK STATUS ERROR:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
