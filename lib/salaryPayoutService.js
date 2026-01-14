// lib/salaryPayoutService.js
import prisma from "@/lib/prisma";
import { VIP_RANKS } from "@/lib/vipConfig";

export async function runMonthlySalaryPayout() {
    const now = new Date();
    const month =
        now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0");

    const ranks = await prisma.userRank.findMany({
        where: {
            salaryStartAt: { lte: now },
        },
    });

    let processed = 0;

    for (const r of ranks) {
        const rule = VIP_RANKS.find((x) => x.rank === r.rank);
        if (!rule) continue;

        const exists = await prisma.salaryPayout.findFirst({
            where: { userId: r.userId, month },
        });
        if (exists) continue;

        await prisma.salaryPayout.create({
            data: {
                userId: r.userId,
                rank: r.rank,
                amount: rule.salary,
                month,
                status: "PENDING",
            },
        });

        processed++;
    }

    return { month, processed };
}
