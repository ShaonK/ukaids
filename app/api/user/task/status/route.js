import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";

export async function GET() {
  try {
    const user = await getUser();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const earning = await prisma.roiearning.findFirst({
      where: { userId: user.id, isActive: true },
      orderBy: { id: "desc" }
    });

    if (!earning)
      return Response.json({ success: true, hasEarning: false });

    const now = new Date();
    const ready = earning.nextRun <= now;

    return Response.json({
      success: true,
      hasEarning: true,
      earning: {
        id: earning.id,
        amount: earning.amount,
        nextRun: earning.nextRun,
        totalEarned: earning.totalEarned,
        maxEarnable: earning.maxEarnable,
        isReady: ready
      }
    });

  } catch (err) {
    console.error("TASK STATUS ERROR:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
