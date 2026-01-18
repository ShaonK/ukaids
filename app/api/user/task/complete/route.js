import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";
import { creditWallet } from "@/lib/walletService";
import { distributeLevelIncome } from "@/lib/levelService";

export async function POST() {
  try {
    const user = await getUser();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const activePkg = await prisma.userPackage.findFirst({
      where: { userId: user.id, isActive: true },
    });

    if (!activePkg) {
      return Response.json(
        { error: "No active package" },
        { status: 400 }
      );
    }

    const settings = await prisma.roiSettings.findFirst();
    const roiDays = settings?.roiDays?.split(",") ?? [
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
    ];
    const timezone = settings?.timezone || "Asia/Dhaka";

    const now = new Date(
      new Date().toLocaleString("en-US", { timeZone: timezone })
    );

    const dayShort = now.toLocaleDateString("en-US", {
      weekday: "short",
      timeZone: timezone,
    });

    if (!roiDays.includes(dayShort)) {
      return Response.json(
        { error: "Task not available today" },
        { status: 400 }
      );
    }

    const todayMidnight = new Date(now);
    todayMidnight.setHours(0, 0, 0, 0);

    if (
      activePkg.lastRoiAt &&
      new Date(activePkg.lastRoiAt) >= todayMidnight
    ) {
      return Response.json(
        { error: "Task already completed today" },
        { status: 400 }
      );
    }

    const roiAmount = Number((activePkg.amount * 0.02).toFixed(6));

    await prisma.$transaction(async (tx) => {
      await creditWallet({
        tx,
        userId: user.id,
        walletType: "ROI",
        amount: roiAmount,
        source: "TASK_ROI",
        note: "Daily task ROI",
      });

      await tx.roiHistory.create({
        data: {
          userId: user.id,
          amount: roiAmount,
          earningId: null,
        },
      });

      await tx.userPackage.update({
        where: { id: activePkg.id },
        data: {
          lastRoiAt: now,
          totalEarned: { increment: roiAmount },
        },
      });
    });

    await distributeLevelIncome({
      buyerId: user.id,
      roiAmount,
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error("TASK COMPLETE ERROR:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
