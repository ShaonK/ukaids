const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function run() {
  console.log("⏳ Seeding deposit history for ALL active users...");

  const wallets = await prisma.wallet.findMany({
    where: {
      depositWallet: { gt: 0 },
    },
    include: {
      user: true,
    },
  });

  for (const w of wallets) {
    // ❌ inactive user skip
    if (!w.user?.isActive) continue;

    // 🔍 already has deposit history?
    const historyExists = await prisma.depositHistory.findFirst({
      where: { userId: w.userId },
    });

    if (historyExists) continue;

    // 🔍 deposit row
    let deposit = await prisma.deposit.findFirst({
      where: { userId: w.userId },
    });

    const trxId = `SEED-${Date.now()}-${w.userId}`;

    if (!deposit) {
      deposit = await prisma.deposit.create({
        data: {
          userId: w.userId,
          amount: w.depositWallet,
          trxId,
          status: "approved",
        },
      });
    }

    await prisma.depositHistory.create({
      data: {
        userId: w.userId,
        depositId: deposit.id,
        amount: w.depositWallet,
        trxId: deposit.trxId,
        status: "approved",
        processedBy: 1,
      },
    });

    console.log(`✅ Seeded userId=${w.userId}`);
  }

  console.log("Deposit history seed completed");
}

run()
  .catch((err) => {
    console.error("Seed error:", err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
