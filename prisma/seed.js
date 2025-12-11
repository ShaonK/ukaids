import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

async function main() {
  console.log("🌱 Cleaning database...");

  // DELETE ORDER (deep → shallow)
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

  console.log("🧹 Database cleaned!");

  console.log("🌱 Seeding fresh user chain...");

  const hashed = await bcrypt.hash("1234", 10);

  // ---- ROOT USER ----
  const root = await prisma.user.create({
    data: {
      fullname: "Root User",
      username: "root",
      referralCode: "RROOT",
      mobile: "0000000000",
      password: hashed,
      txnPassword: hashed,
      isActive: false,
      isBlocked: false,
      isSuspended: false,
    },
  });

  await prisma.wallet.create({ data: { userId: root.id } });

  let previousUserId = root.id;

  // ---- USERS 1 → 10 ----
  for (let i = 1; i <= 10; i++) {
    const user = await prisma.user.create({
      data: {
        fullname: `User ${i}`,
        username: `${i}`,
        referralCode: `R${i}`,
        mobile: `01000000${i}`,
        password: hashed,
        txnPassword: hashed,
        referredBy: previousUserId,
        isActive: false,
        isBlocked: false,
        isSuspended: false,
      },
    });

    await prisma.wallet.create({
      data: { userId: user.id },
    });

    previousUserId = user.id;
  }

  console.log("✅ Seeding completed successfully!");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
