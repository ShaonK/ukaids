// app/api/admin/deposit/approve/route.js
import prisma from "@/lib/prisma";
import { updateUserActiveStatus, openActiveHistory } from "@/lib/updateUserActiveStatus";
import { onRoiGenerated } from "@/lib/onRoiGenerated";
import { creditWallet } from "@/lib/walletService";

const DEBUG = true;
function log(...x) {
  if (DEBUG) console.log("🟡 [APPROVE-DEBUG]:", ...x);
}

export async function POST(req) {
  try {
    log("API HIT");

    // ---------------------------------
    // 1) PARSE REQUEST
    // ---------------------------------
    const body = await req.json().catch(() => null);
    const id = Number(body?.id || body?.depositId);

    if (!id) {
      return Response.json({ error: "Deposit ID missing" }, { status: 400 });
    }

    // ---------------------------------
    // 2) Load deposit + user
    // ---------------------------------
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

    // ---------------------------------
    // 3) Load Admin
    // ---------------------------------
    const admin = await prisma.admin.findFirst();
    if (!admin) {
      return Response.json({ error: "Admin missing" }, { status: 500 });
    }

    // ---------------------------------
    // 4) Approve deposit
    // ---------------------------------
    await prisma.deposit.update({
      where: { id },
      data: { status: "approved" },
    });

    // ---------------------------------
    // 5) CREDIT ACCOUNT WALLET (AUDITED)
    // ---------------------------------
    await creditWallet({
      userId,
      walletType: "ACCOUNT",
      amount,
      source: "DEPOSIT_APPROVE",
      referenceId: id,
      note: `Deposit approved (trx: ${deposit.trxId})`,
    });

    // ---------------------------------
    // 6) Log ApprovedDeposit
    // ---------------------------------
    await prisma.approvedDeposit.create({
      data: {
        userId,
        amount,
        trxId: deposit.trxId,
      },
    });

    // ---------------------------------
    // 7) Log DepositHistory
    // ---------------------------------
    await prisma.depositHistory.create({
      data: {
        userId,
        depositId: id,
        amount,
        trxId: deposit.trxId,
        status: "approved",
        processedBy: admin.id,
      },
    });

    // ---------------------------------
    // 8) Auto Activate User
    // ---------------------------------
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

    // ---------------------------------
    // 9) INSTANT ROI (2%)
    // ---------------------------------
    const roiPercent = 0.02;
    const roiAmount = Number((amount * roiPercent).toFixed(6));
    const maxEarnable = Number((amount * 2).toFixed(6));
    const nextRun = new Date(Date.now() + 60 * 1000);

    // CREDIT ROI WALLET (AUDITED)
    await creditWallet({
      userId,
      walletType: "ROI",
      amount: roiAmount,
      source: "ROI_INSTANT",
      referenceId: id,
      note: "Instant ROI on deposit approval",
    });

    // create ROI earning
    const earningRow = await prisma.roiEarning.create({
      data: {
        userId,
        depositId: id,
        amount: roiAmount,
        totalEarned: roiAmount,
        maxEarnable,
        nextRun,
        isActive: true,
      },
    });

    // create ROI history
    const roiHistory = await prisma.roiHistory.create({
      data: {
        userId,
        earningId: earningRow.id,
        amount: roiAmount,
      },
    });

    // ---------------------------------
    // 10) REFERRAL COMMISSION
    // ---------------------------------
    const REF_RATES = [0.10, 0.03, 0.02];

    const p1 = deposit.user.referredBy;
    const p2 = p1 ? (await prisma.user.findUnique({ where: { id: p1 } }))?.referredBy : null;
    const p3 = p2 ? (await prisma.user.findUnique({ where: { id: p2 } }))?.referredBy : null;

    async function payReferral(uplineId, rate, level) {
      if (!uplineId) return;

      const up = await prisma.user.findUnique({
        where: { id: uplineId },
        select: { isActive: true, isBlocked: true, isSuspended: true },
      });

      if (!up?.isActive || up.isBlocked || up.isSuspended) return;

      const commission = Number((amount * rate).toFixed(6));

      await creditWallet({
        userId: uplineId,
        walletType: "REFERRAL",
        amount: commission,
        source: "REFERRAL_COMMISSION",
        referenceId: id,
        note: `Referral L${level} commission`,
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

    await payReferral(p1, REF_RATES[0], 1);
    await payReferral(p2, REF_RATES[1], 2);
    await payReferral(p3, REF_RATES[2], 3);

    // ---------------------------------
    // 11) LEVEL INCOME (SHARED ENGINE)
    // ---------------------------------
    await onRoiGenerated({
      roiUserId: userId,
      roiAmount,
      roiEventId: roiHistory.id,
      source: "deposit",
    });

    // ---------------------------------
    // 12) FINAL ACTIVE CHECK
    // ---------------------------------
    await updateUserActiveStatus(userId);

    return Response.json({ success: true });

  } catch (err) {
    console.error("❌ APPROVE ERROR:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
