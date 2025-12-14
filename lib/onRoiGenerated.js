// lib/onRoiGenerated.js
import prisma from "./prisma.js";

const LEVEL_RATES = {
  1: 0.05,
  2: 0.04,
  3: 0.03,
  4: 0.02,
  5: 0.01,
};

export async function onRoiGenerated({
  roiUserId,
  roiAmount,
  roiEventId,
  source, // 🔥 MUST
}) {
  // 🚫 HARD BLOCK
  if (source !== "task" && source !== "deposit") {
    return;
  }

  let currentUserId = roiUserId;
  let generation = 1;

  while (generation <= 5) {
    const current = await prisma.user.findUnique({
      where: { id: currentUserId },
      select: { referredBy: true },
    });

    const uplineId = current?.referredBy;
    if (!uplineId) break;

    const upline = await prisma.user.findUnique({
      where: { id: uplineId },
      select: {
        id: true,
        isActive: true,
        isBlocked: true,
        isSuspended: true,
      },
    });

    const directCount = await prisma.user.count({
      where: { referredBy: uplineId },
    });

    const unlockedLevel = Math.min(directCount, 5);

    if (
      upline &&
      upline.isActive &&
      !upline.isBlocked &&
      !upline.isSuspended &&
      generation <= unlockedLevel
    ) {
      const rate = LEVEL_RATES[generation];
      const amount = Number((roiAmount * rate).toFixed(2));

      if (amount > 0) {
        await prisma.$transaction([
          prisma.wallet.update({
            where: { userId: uplineId },
            data: { levelWallet: { increment: amount } },
          }),
          prisma.roiLevelIncome.create({
            data: {
              userId: uplineId,
              fromUserId: roiUserId,
              level: generation,
              amount,
              source, // ✅ track source
              roiHistoryId: roiEventId,
            },
          }),
        ]);
      }
    }

    currentUserId = uplineId;
    generation++;
  }
}
