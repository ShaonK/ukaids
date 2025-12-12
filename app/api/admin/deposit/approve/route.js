// app/api/admin/deposit/approve/route.js
import prisma from "@/lib/prisma";
import { updateUserActiveStatus, openActiveHistory } from "@/lib/updateUserActiveStatus";

export async function POST(req) {
  try {
    const { id } = await req.json();

    const deposit = await prisma.deposit.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!deposit) {
      return Response.json({ error: "Deposit not found" }, { status: 400 });
    }

    if (deposit.status !== "pending") {
      return Response.json({ error: "Already processed" }, { status: 400 });
    }

    const userId = deposit.userId;
    const amount = deposit.amount;

    // -------------------------------------------------------
    // 1) APPROVE DEPOSIT
    // -------------------------------------------------------
    await prisma.deposit.update({
      where: { id },
      data: { status: "approved" },
    });

    // -------------------------------------------------------
    // 2) CREDIT MAIN WALLET
    // -------------------------------------------------------
    await prisma.wallet.update({
      where: { userId },
      data: { mainWallet: { increment: amount } },
    });

    // -------------------------------------------------------
    // 3) APPROVED DEPOSIT RECORD
    // -------------------------------------------------------
    await prisma.approvedDeposit.create({
      data: { userId, amount, trxId: deposit.trxId },
    });

    // -------------------------------------------------------
    // 4) DEPOSIT HISTORY
    // -------------------------------------------------------
    await prisma.depositHistory.create({
      data: {
        userId,
        depositId: id,
        amount,
        trxId: deposit.trxId,
        status: "approved",
        processedBy: 1,
      },
    });

    // -------------------------------------------------------
    // 5) AUTO ACTIVATE
    // -------------------------------------------------------
    const usr = await prisma.user.findUnique({
      where: { id: userId },
      select: { isActive: true },
    });

    if (!usr.isActive) {
      await prisma.user.update({
        where: { id: userId },
        data: { isActive: true },
      });

      await openActiveHistory(userId, "Deposit approved → activated");
    }

    // -------------------------------------------------------
    // 6) INSTANT ROI
    // -------------------------------------------------------
    const roiPercent = 0.02;
    const instantRoi = Number((amount * roiPercent).toFixed(6));
    const maxEarnable = Number((amount * 2).toFixed(6));

    await prisma.wallet.update({
      where: { userId },
      data: { roiWallet: { increment: instantRoi } },
    });

    const nextRun = new Date(Date.now() + 60 * 1000);

    const earningRow = await prisma.roiEarning.create({
      data: {
        userId,
        depositId: id,
        amount: instantRoi,
        totalEarned: instantRoi,
        maxEarnable,
        nextRun,
        isActive: true,
      },
    });

    await prisma.roiHistory.create({
      data: { userId, earningId: earningRow.id, amount: instantRoi },
    });

    // -------------------------------------------------------
    // 7) REFERRAL COMMISSION (3 LVL) → ACTIVE ONLY
    // -------------------------------------------------------
    const LEVEL_PERCENTS = [0.10, 0.03, 0.02];

    async function payReferralLevel(uplineId, commission, level) {
      if (!uplineId) return;

      const up = await prisma.user.findUnique({
        where: { id: uplineId },
        select: { isActive: true, isBlocked: true, isSuspended: true },
      });

      if (!up || !up.isActive || up.isBlocked || up.isSuspended) return;

      await prisma.wallet.update({
        where: { userId: uplineId },
        data: { referralWallet: { increment: commission } },
      });

      await prisma.referralCommissionHistory.create({
        data: {
          userId: uplineId,
          fromUserId: userId,
          depositId: id,
          level,
          commission,
        },
      });
    }

    const p1 = deposit.user.referredBy;
    const p2 = p1 ? (await prisma.user.findUnique({ where: { id: p1 } }))?.referredBy : null;
    const p3 = p2 ? (await prisma.user.findUnique({ where: { id: p2 } }))?.referredBy : null;

    const commissions = [
      Number((amount * LEVEL_PERCENTS[0]).toFixed(6)),
      Number((amount * LEVEL_PERCENTS[1]).toFixed(6)),
      Number((amount * LEVEL_PERCENTS[2]).toFixed(6)),
    ];

    await payReferralLevel(p1, commissions[0], 1);
    await payReferralLevel(p2, commissions[1], 2);
    await payReferralLevel(p3, commissions[2], 3);

    // -------------------------------------------------------
    // 8) LEVEL INCOME — Direct Referral Based Unlock
    // -------------------------------------------------------
    // direct_count decides how many levels unlock
    const directCount = await prisma.user.count({
      where: { referredBy: userId },
    });

    const LEVELS = [0.05, 0.04, 0.04, 0.03, 0.02];
    const unlockedLevels = Math.min(directCount, 5);

    async function distributeLevelIncome(fromUserId, baseAmount) {
      if (unlockedLevels === 0) return;

      let current = fromUserId;
      let level = 0;

      while (level < unlockedLevels) {
        const u = await prisma.user.findUnique({
          where: { id: current },
          select: { referredBy: true },
        });

        const parentId = u?.referredBy ?? null;
        if (!parentId) break;

        // self income protection
        if (parentId === fromUserId) break;

        const parent = await prisma.user.findUnique({
          where: { id: parentId },
          select: {
            isActive: true,
            isBlocked: true,
            isSuspended: true,
          },
        });

        current = parentId;

        if (!parent || !parent.isActive || parent.isBlocked || parent.isSuspended) {
          level++;
          continue;
        }

        const percent = LEVELS[level];
        const commission = Number((baseAmount * percent).toFixed(6));

        await prisma.wallet.update({
          where: { userId: parentId },
          data: { levelWallet: { increment: commission } },
        });

        await prisma.roiLevelIncome.create({
          data: {
            userId: parentId,
            fromUserId,
            level: level + 1,
            amount: commission,
          },
        });

        level++;
      }
    }

    await distributeLevelIncome(userId, instantRoi);

    // -------------------------------------------------------
    // 9) FINAL ACTIVE RECHECK
    // -------------------------------------------------------
    await updateUserActiveStatus(userId);

    return Response.json({ success: true });

  } catch (err) {
    console.error("Deposit Approve ERROR:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
