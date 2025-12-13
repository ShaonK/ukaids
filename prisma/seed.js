// prisma/seed.js
import prisma from "../lib/prisma.js";

async function main() {
  console.log("🧹 Cleaning entire database...");

  // DELETE ORDER (deep → shallow)
  await prisma.userStatusHistory.deleteMany();
  await prisma.roiLevelIncome.deleteMany();
  await prisma.referralCommissionHistory.deleteMany();
  await prisma.roiHistory.deleteMany();
  await prisma.roiEarning.deleteMany();
  await prisma.userDepositRoi.deleteMany();

  await prisma.depositHistory.deleteMany();
  await prisma.approvedDeposit.deleteMany();
  await prisma.rejectedDeposit.deleteMany();
  await prisma.approvedWithdraw.deleteMany();
  await prisma.rejectedWithdraw.deleteMany();
  await prisma.withdraw.deleteMany();
  await prisma.deposit.deleteMany();

  await prisma.wallet.deleteMany();
  await prisma.user.deleteMany();

  console.log("✅ Database fully cleaned! No data inserted.");
  console.log("➡ Now run your ROOT seed.js to generate accounts.");
}

main()
  .catch((err) => {
    console.error("❌ Clean Error:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
