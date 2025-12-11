// app/api/user/task/status/route.js
import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";

export async function GET() {
  try {
    const user = await getUser();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    // ALWAYS fetch correct ROI row:
    const earning = await prisma.roiEarning.findFirst({
      where: { userId: user.id },
      orderBy: [
        { isActive: "desc" },
        { nextRun: "asc" },
      ],
    });

    if (!earning) {
      return Response.json({
        success: true,
        hasEarning: false,
        isReady: false,
      });
    }

    const now = new Date();
    const isReady = earning.isActive && earning.nextRun <= now;

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
