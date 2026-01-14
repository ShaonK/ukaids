// lib/adminRankService.js
import prisma from "@/lib/prisma";
import { VIP_RANKS } from "@/lib/vipConfig";

export async function getEligibleUsers() {
    const users = await prisma.user.findMany({
        include: {
            userRank: true,
        },
    });

    const results = [];

    for (const user of users) {
        const directCount = await prisma.user.count({
            where: { referredBy: user.id },
        });

        const rule = VIP_RANKS.find(
            (r) => directCount >= r.direct
        );

        if (!rule) continue;

        if (
            user.userRank &&
            user.userRank.rank === rule.rank
        ) {
            continue;
        }

        results.push({
            userId: user.id,
            username: user.username,
            directCount,
            eligibleRank: rule.rank,
        });
    }

    return results;
}

export async function adminAssignRank(adminId, userId, rankRule) {
    const salaryStartAt = new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
    );

    return prisma.userRank.upsert({
        where: { userId },
        update: {
            rank: rankRule.rank,
            achievedAt: new Date(),
            salaryStartAt,
            isLifetime: rankRule.lifetime,
            assignedByAdmin: true,
        },
        create: {
            userId,
            rank: rankRule.rank,
            achievedAt: new Date(),
            salaryStartAt,
            isLifetime: rankRule.lifetime,
            assignedByAdmin: true,
        },
    });
}
