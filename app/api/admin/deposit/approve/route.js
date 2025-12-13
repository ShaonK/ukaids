// app/api/admin/deposit/approve/route.js
import prisma from "@/lib/prisma";
import { updateUserActiveStatus, openActiveHistory } from "@/lib/updateUserActiveStatus";
import { onRoiGenerated } from "@/lib/onRoiGenerated";

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

    log("DEPOSIT ID =", id);

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

    log("Processing Deposit For User:", userId);

    // ---------------------------------
    // 3) Load Admin
    // ---------------------------------
    const admin = await prisma.admin.findFirst();
    if (!admin) {
      log("❌ No Admin Found!");
      return Response.json({ error: "Admin missing" }, { status: 500 });
    }

    // ---------------------------------
    // 4) Approve deposit
    // ---------------------------------
    await prisma.deposit.update({
      where: { id },
      data: { status: "approved" },
    });

    log("✔ Deposit Approved");

    // ---------------------------------
    // 5) Credit main wallet
    // ---------------------------------
    await prisma.wallet.update({
      where: { userId },
      data: { mainWallet: { increment: amount } },
    });

    log("✔ Wallet credited");

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

    log("✔ DepositHistory saved");

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
      log("✔ User activated");
    }

    // ---------------------------------
    // 9) INSTANT ROI (2%)
    // ---------------------------------
    const roiPercent = 0.02;
    const roiAmount = Number((amount * roiPercent).toFixed(6));
    const maxEarnable = Number((amount * 2).toFixed(6));
    const nextRun = new Date(Date.now() + 60 * 1000);

    log("ROI Amount =", roiAmount);

    // credit ROI wallet
    await prisma.wallet.update({
      where: { userId },
      data: { roiWallet: { increment: roiAmount } },
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

    // create ROI history (capture it)
    const roiHistory = await prisma.roiHistory.create({
      data: {
        userId,
        earningId: earningRow.id,
        amount: roiAmount,
      },
    });

    log("✔ ROI processed");

    // ---------------------------------
    // 10) REFERRAL COMMISSION (3 levels)
    // ---------------------------------
    const REF_RATES = [0.10, 0.03, 0.02];

    const p1 = deposit.user.referredBy;
    const p2 = p1
      ? (await prisma.user.findUnique({ where: { id: p1 } }))?.referredBy
      : null;
    const p3 = p2
      ? (await prisma.user.findUnique({ where: { id: p2 } }))?.referredBy
      : null;

    async function payReferral(uplineId, rate, level) {
      if (!uplineId) return;

      const up = await prisma.user.findUnique({
        where: { id: uplineId },
        select: { isActive: true, isBlocked: true, isSuspended: true },
      });

      if (!up?.isActive || up.isBlocked || up.isSuspended) return;

      const commission = Number((amount * rate).toFixed(6));

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

      log(`✔ Referral L${level} Paid =`, commission);
    }

    await payReferral(p1, REF_RATES[0], 1);
    await payReferral(p2, REF_RATES[1], 2);
    await payReferral(p3, REF_RATES[2], 3);

    // ---------------------------------
    // 11) LEVEL INCOME (SHARED – INDUSTRY STANDARD)
    // ---------------------------------
    await onRoiGenerated({
      roiUserId: userId,
      roiAmount: roiAmount,
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
