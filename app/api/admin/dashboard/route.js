export const runtime = "nodejs";

import prisma from "@/lib/prisma";

export async function GET() {
    try {
        // BASIC COUNTS
        const users = await prisma.user.count();
        const referrals = await prisma.user.count({
            where: { referredBy: { not: null } }
        });

        const earnings = await prisma.approvedDeposit.aggregate({
            _sum: { amount: true }
        });

        const withdrawRequests = await prisma.withdraw.count({
            where: { status: "pending" }
        });

        const activeDeposits = await prisma.approvedDeposit.count();
        const pendingDeposits = await prisma.deposit.count({
            where: { status: "pending" }
        });

        const totalWithdraws = await prisma.withdraw.count();

        // --- User Stats ---
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const newUsersToday = await prisma.user.count({
            where: { createdAt: { gte: today } }
        });

        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);

        const newUsersWeek = await prisma.user.count({
            where: { createdAt: { gte: weekAgo } }
        });

        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);

        const newUsersMonth = await prisma.user.count({
            where: { createdAt: { gte: monthAgo } }
        });

        // --- Referral Performance ---
        const referralClicks = 350; // রাখতে চাও → স্ট্যাটিক নয় হলে আমি টেবিল তৈরি করে দিব
        const conversionRate = 14.3;

        return Response.json({
            users,
            referrals,
            earnings: earnings._sum.amount || 0,
            withdrawRequests,
            activeDeposits,
            pendingDeposits,
            totalWithdraws,
            newUsersToday,
            newUsersWeek,
            newUsersMonth,
            referralClicks,
            conversionRate
        });

    } catch (e) {
        console.error(e);
        return Response.json({ error: "Failed to load dashboard" }, { status: 500 });
    }
}
