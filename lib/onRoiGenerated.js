// lib/onRoiGenerated.js
import prisma from "./prisma.js";


// FINAL LEVEL RATES (LOCKED)
const LEVEL_RATES = {
  1: 0.05,
  2: 0.04,
  3: 0.03,
  4: 0.02,
  5: 0.01,
};

/**
 * Shared Level Income Generator
 *
 * @param {number} roiUserId   - যিনি ROI পেয়েছেন (downline)
 * @param {number} roiAmount   - এই ROI event-এর amount
 * @param {number} roiEventId  - roiHistory.id
 * @param {string} source      - "deposit" | "task" | future
 */
export async function onRoiGenerated({
  roiUserId,
  roiAmount,
  roiEventId,
  source = "unknown",
}) {
  let currentUserId = roiUserId;
  let generation = 1;

  while (generation <= 5) {
    // 1) Get parent (upline)
    const current = await prisma.user.findUnique({
      where: { id: currentUserId },
      select: { referredBy: true },
    });

    const uplineId = current?.referredBy;
    if (!uplineId) break;

    // 2) Load upline status
    const upline = await prisma.user.findUnique({
      where: { id: uplineId },
      select: {
        id: true,
        isActive: true,
        isBlocked: true,
        isSuspended: true,
      },
    });

    // 3) Check unlock rule (direct referrals of THIS upliner)
    const directCount = await prisma.user.count({
      where: { referredBy: uplineId },
    });

    const unlockedLevel = Math.min(directCount, 5);

    // 4) Eligible?
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
        // Atomic update
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
              // NOTE:
              // roiEventId & source field
              // schema change হলে এখানে যোগ হবে
            },
          }),
        ]);
      }
    }

    // 5) Move up
    currentUserId = uplineId;
    generation++;
  }
}
 