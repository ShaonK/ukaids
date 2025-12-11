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
        processedBy: 1, // change to real admin id if available
      },
    });

    // -------------------------
    // 5) Instant ROI credit (first instant payout) + create RoiEarning for next cycles
    // -------------------------
    const roiPercent = 0.02; // 2%
    const instantRoi = Number((amount * roiPercent).toFixed(6)); // small rounding
    const maxEarnable = Number((amount * 2).toFixed(6)); // 200% cap

    // credit instant ROI to roiWallet
    await prisma.wallet.update({
      where: { userId },
      data: { roiWallet: { increment: instantRoi } },
    });

    // create RoiEarning row: mark totalEarned = instantRoi (already credited)
    // nextRun = now + 1 minute (TEST). For production change to 24h.
    const nextRun = new Date(Date.now() + 1 * 60 * 1000); // TEST: 1 minute

    const createdEarning = await prisma.roiEarning.create({
      data: {
        userId,
        depositId: id,
        amount: instantRoi,      // per-cycle payout amount (2% of deposit)
        totalEarned: instantRoi, // we already paid instant
        maxEarnable,
        nextRun,
        isActive: true,
      },
    });

    // create roiHistory entry referencing the created earning
    await prisma.roiHistory.create({
      data: {
        userId,
        earningId: createdEarning.id,
        amount: instantRoi,
      },
    });

    // -------------------------
    // 6) Referral commission (existing behaviour)
    // -------------------------
    const L1 = 0.10;
    const L2 = 0.03;
    const L3 = 0.02;

    let lvl1 = deposit.user.referredBy ?? null;
    let lvl2 = null;
    let lvl3 = null;

    if (lvl1) {
      const p1 = await prisma.user.findUnique({ where: { id: lvl1 } });
      if (p1?.referredBy) lvl2 = p1.referredBy;
      if (lvl2) {
        const p2 = await prisma.user.findUnique({ where: { id: lvl2 } });
        if (p2?.referredBy) lvl3 = p2.referredBy;
      }
    }

    const c1 = Number((amount * L1).toFixed(6));
    const c2 = Number((amount * L2).toFixed(6));
    const c3 = Number((amount * L3).toFixed(6));

    if (lvl1) {
      await prisma.wallet.update({
        where: { userId: lvl1 },
        data: { referralWallet: { increment: c1 } },
      });
      await prisma.referralCommissionHistory.create({
        data: {
          userId: lvl1,
          fromUserId: userId,
          depositId: id,
          level: 1,
          commission: c1,
        },
      });
    }

    if (lvl2) {
      await prisma.wallet.update({
        where: { userId: lvl2 },
        data: { referralWallet: { increment: c2 } },
      });
      await prisma.referralCommissionHistory.create({
        data: {
          userId: lvl2,
          fromUserId: userId,
          depositId: id,
          level: 2,
          commission: c2,
        },
      });
    }

    if (lvl3) {
      await prisma.wallet.update({
        where: { userId: lvl3 },
        data: { referralWallet: { increment: c3 } },
      });
      await prisma.referralCommissionHistory.create({
        data: {
          userId: lvl3,
          fromUserId: userId,
          depositId: id,
          level: 3,
          commission: c3,
        },
      });
    }

    // -------------------------
    // 7) LEVEL INCOME (based on the instant ROI payout)
    //    levels: 5%, 4%, 4%, 3%, 2%, 1%   (6 levels)
    //    SKIP inactive/blocked/suspended parents and continue upward until 6 eligible levels found
    // -------------------------
    async function distributeLevelIncomeSkipInactive(fromUserId, baseAmount, depositId) {
      const levelPercents = [0.05, 0.04, 0.04, 0.03, 0.02, 0.01];
      let levelIndex = 0;
      let currentUserId = fromUserId;

      // Loop until we've assigned all levelPercents or chain ends
      while (levelIndex < levelPercents.length) {
        // find immediate parent of currentUserId
        const child = await prisma.user.findUnique({
          where: { id: currentUserId },
          select: { referredBy: true },
        });

        const parentId = child?.referredBy ?? null;
        if (!parentId) break; // chain ended

        // fetch parent's status
        const parent = await prisma.user.findUnique({
          where: { id: parentId },
          select: { id: true, isActive: true, isBlocked: true, isSuspended: true },
        });

        // move current pointer up for next iteration regardless of skip or assign
        currentUserId = parentId;

        // if parent not eligible, SKIP (do not increment levelIndex), continue upward
        if (!parent || !parent.isActive || parent.isBlocked || parent.isSuspended) {
          continue; // skip this parent but continue searching higher
        }

        // parent is eligible — assign this level
        const percent = levelPercents[levelIndex];
        const commission = Number((baseAmount * percent).toFixed(6));
        if (commission > 0) {
          // credit to parent's levelWallet
          await prisma.wallet.update({
            where: { userId: parentId },
            data: { levelWallet: { increment: commission } },
          });

          // create RoiLevelIncome history row
          await prisma.roiLevelIncome.create({
            data: {
              userId: parentId,
              fromUserId: fromUserId,
              level: levelIndex + 1,
              amount: commission,
            },
          });
        }

        // move to next level slot
        levelIndex++;
      }
    }

    // distribute level income based on instantRoi (using skip-inactive rule)
    await distributeLevelIncomeSkipInactive(userId, instantRoi, id);

    return Response.json({ success: true, earningId: createdEarning.id });
  } catch (err) {
    console.error("APPROVE ERROR:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
