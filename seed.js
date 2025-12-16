import prisma from "./lib/prisma.js";
import bcrypt from "bcryptjs";

async function main() {
  console.log("⏳ Running Seeder...");

  /**
   * =========================
   * 1️⃣ ADMIN CREATE
   * =========================
   */
  const adminExists = await prisma.admin.findFirst();

  if (!adminExists) {
    const adminPassword = await bcrypt.hash("admin123", 10);

    const admin = await prisma.admin.create({
      data: {
        username: "admin",
        password: adminPassword,
      },
    });

    console.log("✅ Admin created:", admin.username);
  } else {
    console.log("✔ Admin already exists");
  }

  /**
   * =========================
   * 2️⃣ ROOT USER CREATE
   * =========================
   */
  const rootExists = await prisma.user.findUnique({
    where: { username: "root" },
  });

  if (rootExists) {
    console.log("✔ Root user already exists (ID:", rootExists.id + ")");
    return;
  }

  const passwordHash = await bcrypt.hash("12345", 10);
  const txnPasswordHash = await bcrypt.hash("67890", 10);

  const rootUser = await prisma.user.create({
    data: {
      fullname: "Root User",
      username: "root",
      referralCode: "ROOT000",
      mobile: "0000000000",
      email: "root@mail.com",
      password: passwordHash,
      txnPassword: txnPasswordHash,
      isActive: true, // 🔥 ACTIVE
    },
  });

  console.log("✅ Root user created:", rootUser.username);

  /**
   * =========================
   * 3️⃣ WALLET CREATE
   * =========================
   */
  await prisma.wallet.create({
    data: {
      userId: rootUser.id,
      mainWallet: 0,
      depositWallet: 0,
      roiWallet: 0,
      referralWallet: 0,
      levelWallet: 0,
      returnWallet: 0,
    },
  });

  console.log("✅ Wallet created for root user");

  /**
   * =========================
   * 4️⃣ USER STATUS HISTORY
   * =========================
   */
  await prisma.userStatusHistory.create({
    data: {
      userId: rootUser.id,
      status: "active",
      reason: "Initial root user activation",
    },
  });

  console.log("✅ User status history added");

  console.log("🎉 SEED COMPLETED SUCCESSFULLY");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Seeder failed:", err);
    process.exit(1);
  });
