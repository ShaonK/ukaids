// reset-level-income.js
import prisma from "./lib/prisma.js";

const CORRECT_RATES = {
    1: 0.05,
    2: 0.04,
    3: 0.03,
    4: 0.02,
    5: 0.01,
    default: 0
};

async function recalcLevelIncome() {
    console.log("🔄 Starting Level Income Recalculation...");

    // Load all level incomes
    const rows = await prisma.roiLevelIncome.findMany({
        select: { id: true, userId: true, fromUserId: true, level: true, amount: true }
    });

    console.log(`📊 Total income rows found: ${rows.length}`);

    let totalWalletFix = 0;

    for (const row of rows) {
        const correctRate = CORRECT_RATES[row.level] ?? CORRECT_RATES.default;

        // Find deposit ROI amount (base amount = ROI earning of that deposit)
        const earning = await prisma.roiEarning.findMany({
            where: { userId: row.fromUserId },
            select: { amount: true },
            orderBy: { id: "asc" },
            take: 1
        });

        if (!earning || earning.length === 0) continue;

        const baseROI = earning[0].amount;

        // New correct income
        const newIncome = Number((baseROI * correctRate).toFixed(6));

        // If same → skip
        if (newIncome === row.amount) continue;

        const diff = Number((newIncome - row.amount).toFixed(6));

        console.log(
            `Fixing row: ${row.id} | Level ${row.level} | Old=${row.amount} → New=${newIncome} | Diff=${diff}`
        );

        // 1️⃣ Update wallet (levelWallet += difference)
        await prisma.wallet.update({
            where: { userId: row.userId },
            data: { levelWallet: { increment: diff } }
        });

        // 2️⃣ Update roiLevelIncome record
        await prisma.roiLevelIncome.update({
            where: { id: row.id },
            data: { amount: newIncome }
        });

        totalWalletFix += diff;
    }

    console.log("--------------------------------");
    console.log(`🎯 Wallet adjustments total: ${totalWalletFix.toFixed(6)}`);
    console.log("✔ Recalculation Completed!");
    console.log("--------------------------------");

    await prisma.$disconnect();
}

recalcLevelIncome().catch((err) => {
    console.error(err);
    prisma.$disconnect();
});
