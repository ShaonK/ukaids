export const runtime = "nodejs";

import prisma from "@/lib/prisma";

export async function GET() {
  try {
    /* ===============================
       BASIC COUNTS
    =============================== */
    const users = await prisma.user.count();

    const referrals = await prisma.user.count({
      where: { referredBy: { not: null } },
    });

    /* ===============================
       TOTAL PACKAGE PURCHASE (ALL-TIME) ✅ NEW
       Source of truth: UserPackage.amount
    =============================== */
    const totalPackageAgg = await prisma.userPackage.aggregate({
      _sum: { amount: true },
    });

    const totalPackagePurchaseAmount = Number(
      totalPackageAgg._sum.amount || 0
    );

    /* ===============================
       EARNINGS (AS IS)
    =============================== */
    const earningsAgg = await prisma.deposit.aggregate({
      where: { status: "approved" },
      _sum: { amount: true },
    });

    const earnings = Number(earningsAgg._sum.amount || 0);

    /* ===============================
       WITHDRAW REQUESTS (Pending)
    =============================== */
    const withdrawRequests = await prisma.withdraw.count({
      where: { status: "pending" },
    });

    /* ===============================
       DEPOSITS (Account Balance)
    =============================== */
    const activeDeposits = await prisma.deposit.count({
      where: { status: "approved" },
    });

    const pendingDeposits = await prisma.deposit.count({
      where: { status: "pending" },
    });

    /* ===============================
       WITHDRAWS (All-time real payout)
    =============================== */
    const totalWithdraws = await prisma.approvedWithdraw.count();

    const totalWithdrawAmountAgg =
      await prisma.approvedWithdraw.aggregate({
        _sum: { amount: true },
      });

    const totalWithdrawAmount = Number(
      totalWithdrawAmountAgg._sum.amount || 0
    );

    /* ===============================
       USER STATS
    =============================== */
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const newUsersToday = await prisma.user.count({
      where: { createdAt: { gte: today } },
    });

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const newUsersWeek = await prisma.user.count({
      where: { createdAt: { gte: weekAgo } },
    });

    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    const newUsersMonth = await prisma.user.count({
      where: { createdAt: { gte: monthAgo } },
    });

    /* ===============================
       REFERRAL PERFORMANCE
    =============================== */
    const referralClicks = 350;
    const conversionRate = 14.3;

    return Response.json({
      users,
      referrals,

      // ✅ NEW
      totalPackagePurchaseAmount,

      earnings,
      withdrawRequests,
      activeDeposits,
      pendingDeposits,

      totalWithdraws,
      totalWithdrawAmount,

      newUsersToday,
      newUsersWeek,
      newUsersMonth,

      referralClicks,
      conversionRate,
    });
  } catch (e) {
    console.error("❌ DASHBOARD API ERROR:", e);
    return Response.json(
      { error: "Failed to load dashboard" },
      { status: 500 }
    );
  }
}
