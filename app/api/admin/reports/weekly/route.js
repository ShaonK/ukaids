import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const start = new Date(end);
    start.setDate(end.getDate() - 6);
    start.setHours(0, 0, 0, 0);

    /* ===============================
       DEPOSITS (DepositHistory)
    =============================== */
    const approvedDepositCount = await prisma.depositHistory.count({
      where: {
        status: "approved",
        createdAt: { gte: start, lte: end },
      },
    });

    const approvedDepositSum = await prisma.depositHistory.aggregate({
      where: {
        status: "approved",
        createdAt: { gte: start, lte: end },
      },
      _sum: { amount: true },
    });

    const pendingDepositCount = await prisma.deposit.count({
      where: { status: "pending" },
    });

    const totalDeposits =
      Number(approvedDepositSum?._sum?.amount) || 0;

    /* ===============================
       WITHDRAWS
    =============================== */
    const approvedWithdrawCount = await prisma.approvedWithdraw.count({
      where: {
        createdAt: { gte: start, lte: end },
      },
    });

    const approvedWithdrawSum =
      await prisma.approvedWithdraw.aggregate({
        where: {
          createdAt: { gte: start, lte: end },
        },
        _sum: { amount: true },
      });

    const withdrawFeeSum =
      await prisma.withdrawRequest.aggregate({
        where: {
          status: "approved",
          approvedAt: { gte: start, lte: end },
        },
        _sum: { commission: true },
      });

    const pendingWithdrawCount =
      await prisma.withdrawRequest.count({
        where: { status: "pending" },
      });

    const totalWithdraws =
      Number(approvedWithdrawSum?._sum?.amount) || 0;

    const totalFees =
      Number(withdrawFeeSum?._sum?.commission) || 0;

    const netFlow = Number(
      (totalDeposits - totalWithdraws).toFixed(6)
    );

    return Response.json({
      range: { start, end },

      deposits: {
        count: approvedDepositCount,
        total: totalDeposits,
      },

      withdraws: {
        count: approvedWithdrawCount,
        total: totalWithdraws,
        fee: totalFees,
      },

      pending: {
        deposits: pendingDepositCount,
        withdraws: pendingWithdrawCount,
      },

      totals: {
        netFlow,
      },
    });
  } catch (err) {
    console.error("❌ WEEKLY REPORT API CRASH:", err);

    // 🔥 NEVER return empty response
    return Response.json(
      {
        range: null,
        deposits: { count: 0, total: 0 },
        withdraws: { count: 0, total: 0, fee: 0 },
        pending: { deposits: 0, withdraws: 0 },
        totals: { netFlow: 0 },
        error: "Weekly report failed",
      },
      { status: 500 }
    );
  }
}
