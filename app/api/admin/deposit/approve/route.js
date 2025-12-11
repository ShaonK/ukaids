// app/api/admin/deposit/approve/route.js
import prisma from "@/lib/prisma";

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

    // 0) AUTO ACTIVATE USER ★★★★★
    await prisma.user.update({
      where: { id: userId },
      data: { isActive: true },
    });

    // 1) Approve deposit
    await prisma.deposit.update({
      where: { id },
      data: { status: "approved" },
    });

    // 2) Credit main wallet
    await prisma.wallet.update({
      where: { userId },
      data: { mainWallet: { increment: amount } },
    });

    // 3) Save approvedDeposit record
    await prisma.approvedDeposit.create({
      data: {
        userId,
        amount,
        trxId: deposit.trxId,
      },
    });

    // 4) Insert depositHistory
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

    // INSTANT ROI
    const roiPercent = 0.02;
    const instantRoi = Number((amount * roiPercent).toFixed(6));
    const maxEarnable = Number((amount * 2).toFixed(6));

    await prisma.wallet.update({
      where: { userId },
      data: { roiWallet: { increment: instantRoi } },
    });

    const nextRun = new Date(Date.now() + 1 * 60 * 1000);

    const createdEarning = await prisma.roiEarning.create({
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
      data: {
        userId,
        earningId: createdEarning.id,
        amount: instantRoi,
      },
    });

    // REFERRAL COMMISSION
    const L1 = 0.10, L2 = 0.03, L3 = 0.02;

    let lvl1 = deposit.user.referredBy ?? null;
    let lvl2 = null;
    let lvl3 = null;

    if (lvl1) {
      const p1 = await prisma.user.findUnique({ where: { id: lvl1 } });
      lvl2 = p1?.referredBy ?? null;
      if (lvl2) {
        const p2 = await prisma.user.findUnique({ where: { id: lvl2 } });
        lvl3 = p2?.referredBy ?? null;
      }
    }

    const c1 = Number((amount * L1).toFixed(6));
    const c2 = Number((amount * L2).toFixed(6));
    const c3 = Number((amount * L3).toFixed(6));

    async function payReferral(uplineId, commission, level) {
      if (!uplineId) return;
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

    await payReferral(lvl1, c1, 1);
    await payReferral(lvl2, c2, 2);
    await payReferral(lvl3, c3, 3);

    // LEVEL INCOME (skip inactive)
    async function distributeLevelIncomeSkipInactive(fromUserId, baseAmount) {
      const levelPercents = [0.05, 0.04, 0.04, 0.03, 0.02, 0.01];
      let levelIndex = 0;
      let currentUserId = fromUserId;

      while (levelIndex < levelPercents.length) {
        const child = await prisma.user.findUnique({
          where: { id: currentUserId },
          select: { referredBy: true },
        });

        const parentId = child?.referredBy ?? null;
        if (!parentId) break;

        const parent = await prisma.user.findUnique({
          where: { id: parentId },
          select: { id: true, isActive: true, isBlocked: true, isSuspended: true },
        });

        currentUserId = parentId;

        // skip inactive
        if (!parent || !parent.isActive || parent.isBlocked || parent.isSuspended) {
          continue;
        }

        const percent = levelPercents[levelIndex];
        const commission = Number((baseAmount * percent).toFixed(6));

        await prisma.wallet.update({
          where: { userId: parentId },
          data: { levelWallet: { increment: commission } },
        });

        await prisma.roiLevelIncome.create({
          data: {
            userId: parentId,
            fromUserId,
            level: levelIndex + 1,
            amount: commission,
          },
        });

        levelIndex++;
      }
    }

    await distributeLevelIncomeSkipInactive(userId, instantRoi);

    return Response.json({ success: true, earningId: createdEarning.id });

  } catch (err) {
    console.error("APPROVE ERROR:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
