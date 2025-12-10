// app/api/user/task/status/route.js
import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";

export async function GET() {
  try {
    const user = await getUser();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    // find the latest active earning for this user
    const earning = await prisma.roiEarning.findFirst({
      where: { userId: user.id, isActive: true },
      orderBy: { createdAt: "desc" },
    });

    if (!earning) {
      return Response.json({
        success: true,
        hasEarning: false,
        message: "No active ROI earning found",
      });
    }

    const now = new Date();
    const isReady = earning.nextRun <= now;

    return Response.json({
      success: true,
      hasEarning: true,
      earning: {
        id: earning.id,
        amount: Number(earning.amount),
        nextRun: earning.nextRun,
        totalEarned: Number(earning.totalEarned),
        maxEarnable: Number(earning.maxEarnable),
        isActive: earning.isActive,
        isReady,
      },
    });
  } catch (err) {
    console.error("TASK STATUS ERROR:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
