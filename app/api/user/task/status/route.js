// app/api/user/task/status/route.js
import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";

/**
 * ✅ Next Midnight (00:00) calculator
 */
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
    const nextMidnightMs = getNextMidnightMs();

    /**
     * ✅ READY ONLY AT MIDNIGHT
     */
    const isReady = now >= nextMidnightMs;

    const nextRunMs = isReady
      ? null
      : nextMidnightMs;

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
