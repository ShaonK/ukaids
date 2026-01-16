// app/api/admin/reports/weekly/route.js
import prisma from "@/lib/prisma";

function getWeekRange() {
  const now = new Date();
  const day = now.getDay(); // 0 = Sun
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);

  const start = new Date(now.setDate(diff));
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

export async function GET() {
  try {
    const { start, end } = getWeekRange();

    /* ---------------- DEPOSITS ---------------- */
    const approvedDeposits = await prisma.approvedDeposit.aggregate({
      where: { createdAt: { gte: start, lte: end } },
      _sum: { amount: true },
      _count: true,
    });

    const pendingDeposits = await prisma.deposit.count({
      where: { status: "pending" },
    });

    /* ---------------- WITHDRAWS ---------------- */
    const approvedWithdraws = await prisma.approvedWithdraw.aggregate({
      where: { createdAt: { gte: start, lte: end } },
      _sum: { amount: true },
      _count: true,
    });

    const rejectedWithdraws = await prisma.rejectedWithdraw.aggregate({
      where: { createdAt: { gte: start, lte: end } },
      _sum: { amount: true },
      _count: true,
    });

    const pendingWithdraws = await prisma.withdrawRequest.count({
      where: { status: "pending" },
    });

    const commission = await prisma.withdrawRequest.aggregate({
      where: {
        status: "approved",
        approvedAt: { gte: start, lte: end },
      },
      _sum: { commission: true },
    });

    const netFlow =
      Number(approvedDeposits._sum.amount || 0) -
      Number(approvedWithdraws._sum.amount || 0);

    return Response.json({
      range: { start, end },

      deposits: {
        approved: {
          count: approvedDeposits._count,
          total: approvedDeposits._sum.amount || 0,
        },
        pending: { count: pendingDeposits },
      },

      withdraws: {
        approved: {
          count: approvedWithdraws._count,
          totalNet: approvedWithdraws._sum.amount || 0,
        },
        rejected: {
          count: rejectedWithdraws._count,
          total: rejectedWithdraws._sum.amount || 0,
        },
        pending: { count: pendingWithdraws },
      },

      fees: {
        totalCommission: commission._sum.commission || 0,
        totalPaid: approvedWithdraws._sum.amount || 0,
      },

      netFlow,
    });
  } catch (err) {
    console.error("WEEKLY REPORT ERROR:", err);
    return Response.json(
      { error: "Failed to load weekly report" },
      { status: 500 }
    );
  }
}
