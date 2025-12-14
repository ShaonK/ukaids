// lib/onDepositActivated.js
import prisma from "@/lib/prisma";

export async function onDepositActivated({
  userId,
  depositId,
  tx = prisma,
}) {
  const deposit = await tx.deposit.findUnique({
    where: { id: depositId },
  });

  if (!deposit || deposit.amount <= 0) return;

  const depositAmount = Number(deposit.amount);

  // 🔥 ALWAYS close old ROI engine
  await tx.roiEarning.updateMany({
    where: { userId, isActive: true },
    data: { isActive: false },
  });

  const roiPercent = 0.02;
  const roiUnit = Number((depositAmount * roiPercent).toFixed(6));
  const maxEarnable = Number((depositAmount * 2).toFixed(6));

  const nextRun = new Date(Date.now() + 60 * 1000); // dev

  const earning = await tx.roiEarning.create({
    data: {
      userId,
      depositId,
      amount: roiUnit,        // ✅ correct (50→1, 100→2, 1000→20)
      totalEarned: 0,
      maxEarnable,
      nextRun,
      isActive: true,
    },
  });

  await tx.roiHistory.create({
    data: {
      userId,
      earningId: earning.id,
      amount: 0,
    },
  });
}
