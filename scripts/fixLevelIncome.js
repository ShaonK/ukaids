// scripts/fixLevelIncome.js
import prisma from "../lib/prisma.js";
import { onRoiGenerated } from "../lib/onRoiGenerated.js";


async function main() {
  console.log("🟡 FIX LEVEL INCOME: START");

  // ---------------------------------
  // 1) Reset all level wallets
  // ---------------------------------
  console.log("🔄 Resetting levelWallet = 0");
  await prisma.wallet.updateMany({
    data: { levelWallet: 0 },
  });

  // ---------------------------------
  // 2) Clear old level income history
  // ---------------------------------
  console.log("🧹 Clearing roiLevelIncome table");
  await prisma.roiLevelIncome.deleteMany({});

  // ---------------------------------
  // 3) Load all ROI events (source of truth)
  // ---------------------------------
  const roiEvents = await prisma.roiHistory.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      userId: true,
      amount: true,
    },
  });

  console.log(`📦 Found ${roiEvents.length} ROI events`);

  // ---------------------------------
  // 4) Rebuild level income from ROI events
  // ---------------------------------
  for (const roi of roiEvents) {
    if (roi.amount <= 0) continue;

    await onRoiGenerated({
      roiUserId: roi.userId,
      roiAmount: Number(roi.amount),
      roiEventId: roi.id,
      source: "repair",
    });
  }

  console.log("✅ LEVEL INCOME REBUILD COMPLETE");
}

main()
  .catch((err) => {
    console.error("❌ FIX ERROR:", err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
