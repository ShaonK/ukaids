// lib/levelService.js
import { creditWallet } from "@/lib/walletService";

/**
 * Level income rates (MAX 5 levels)
 */
const LEVEL_RATES = {
    1: 0.05,
    2: 0.04,
    3: 0.03,
    4: 0.02,
    5: 0.01,
};

/**
 * Distribute level income ONLY when ROI is generated
 * Rules:
 * - inactive / blocked / suspended skip
 * - direct referral gate (level unlock)
 * - generation tree respected
 */
export async function distributeLevelIncome({
    tx,
    buyerId,
    roiAmount,
}) {
    let currentUserId = buyerId;
    let level = 1;

    while (level <= 5) {
        // move one step up
        const buyer = await tx.user.findUnique({
            where: { id: currentUserId },
            select: { referredBy: true },
        });

        if (!buyer?.referredBy) break;

        const uplineId = buyer.referredBy;

        const upline = await tx.user.findUnique({
            where: { id: uplineId },
            select: {
                id: true,
                isActive: true,
                isBlocked: true,
                isSuspended: true,
            },
        });

        // ❌ skip inactive / blocked
        if (!upline || !upline.isActive || upline.isBlocked || upline.isSuspended) {
            currentUserId = uplineId;
            level++;
            continue;
        }

        // 🔐 direct referral requirement
        const directCount = await tx.user.count({
            where: { referredBy: upline.id },
        });

        if (directCount < level) {
            currentUserId = uplineId;
            level++;
            continue;
        }

        const rate = LEVEL_RATES[level];
        if (!rate) break;

        const income = Number((roiAmount * rate).toFixed(6));
        if (income <= 0) {
            currentUserId = uplineId;
            level++;
            continue;
        }

        // 💰 credit LEVEL wallet
        await creditWallet({
            tx,
            userId: upline.id,
            walletType: "LEVEL",
            amount: income,
            source: "LEVEL_INCOME",
            note: `Level ${level} income`,
        });

        // 🧾 history
        await tx.roiLevelIncome.create({
            data: {
                userId: upline.id,
                fromUserId: buyerId,
                level,
                amount: income,
            },
        });

        currentUserId = uplineId;
        level++;
    }
}
