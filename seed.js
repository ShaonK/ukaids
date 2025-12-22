import "dotenv/config";
import prisma from "./lib/prisma.js";
import bcrypt from "bcryptjs";

/**
 * 🔒 PRODUCTION GUARD (ONE TIME USE)
 */
if (process.env.NODE_ENV === "production") {
  if (process.env.ALLOW_PROD_SEED !== "true") {
    console.error("❌ Production seed blocked!");
    console.error("👉 Run with ALLOW_PROD_SEED=true");
    process.exit(1);
  }
}

async function main() {
  console.log("🧹 Cleaning database (Package preserved)...");

  /**
   * =========================
   * 1️⃣ CLEAN DATABASE
   * (ORDER IS CRITICAL)
   * =========================
   */

  // ---- USER DEPENDENCIES ----
  await prisma.withdrawAddress.deleteMany();
  await prisma.referralCommissionHistory.deleteMany();
  await prisma.roiLevelIncome.deleteMany();
  await prisma.roiHistory.deleteMany();
  await prisma.roiEarning.deleteMany();
  await prisma.userDepositRoi.deleteMany();

  await prisma.balanceTransfer.deleteMany();

  await prisma.depositHistory.deleteMany();
  await prisma.deposit.deleteMany();
  await prisma.approvedDeposit.deleteMany();
  await prisma.rejectedDeposit.deleteMany();

  await prisma.withdrawRequest.deleteMany();
  await prisma.withdraw.deleteMany();
  await prisma.approvedWithdraw.deleteMany();
  await prisma.rejectedWithdraw.deleteMany();

  await prisma.walletTransaction.deleteMany();
  await prisma.wallet.deleteMany();

  await prisma.userStatusHistory.deleteMany();
  await prisma.userPackage.deleteMany(); // 🔥 Package stays, only relations cleared

  // ---- CORE TABLES ----
  await prisma.user.deleteMany();
  await prisma.adminAuditLog.deleteMany();
  await prisma.admin.deleteMany();

  console.log("✅ Database cleaned (Package untouched)");

  /**
   * =========================
   * 2️⃣ CREATE ADMINS
   * =========================
   */
  const adminPassword = await bcrypt.hash("123456", 10);

  await prisma.admin.createMany({
    data: [
      { username: "AdiminFaruk", password: adminPassword },
      { username: "AdiminSaiful", password: adminPassword },
    ],
  });

  console.log("✅ Admins created");

  /**
   * =========================
   * 3️⃣ CREATE USERS
   * =========================
   */
  const userPassword = await bcrypt.hash("123456", 10);
  const txnPassword = await bcrypt.hash("123456", 10);

  const faruk = await prisma.user.create({
    data: {
      fullname: "Faruk Root",
      username: "FarukRoot",
      referralCode: "FARUKROOT",
      mobile: "880100000001",
      email: "faruk@root.com",
      password: userPassword,
      txnPassword,
      isActive: true,
    },
  });

  const saiful = await prisma.user.create({
    data: {
      fullname: "Saiful Root",
      username: "SaifulRoot",
      referralCode: "SAIFULROOT",
      mobile: "880100000002",
      email: "saiful@root.com",
      password: userPassword,
      txnPassword,
      isActive: true,
    },
  });

  console.log("✅ Users created");

  /**
   * =========================
   * 4️⃣ CREATE WALLETS
   * =========================
   */
  await prisma.wallet.createMany({
    data: [
      {
        userId: faruk.id,
        mainWallet: 0,
        depositWallet: 0,
        roiWallet: 0,
        referralWallet: 0,
        levelWallet: 0,
        returnWallet: 0,
        salaryWallet: 0,
        donationWallet: 0,
      },
      {
        userId: saiful.id,
        mainWallet: 0,
        depositWallet: 0,
        roiWallet: 0,
        referralWallet: 0,
        levelWallet: 0,
        returnWallet: 0,
        salaryWallet: 0,
        donationWallet: 0,
      },
    ],
  });

  console.log("✅ Wallets created");

  /**
   * =========================
   * 5️⃣ USER STATUS HISTORY
   * =========================
   */
  await prisma.userStatusHistory.createMany({
    data: [
      {
        userId: faruk.id,
        status: "active",
        reason: "Initial production reset",
      },
      {
        userId: saiful.id,
        status: "active",
        reason: "Initial production reset",
      },
    ],
  });

  console.log("🎉 SEED COMPLETED SUCCESSFULLY");
}

main()
  .then(() => {
    console.log("✅ DONE. Remember to unset ALLOW_PROD_SEED");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Seeder failed:", err);
    process.exit(1);
  });
