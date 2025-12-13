// app/api/admin/deposit/approve/route.js
import prisma from "@/lib/prisma";
import { updateUserActiveStatus, openActiveHistory } from "@/lib/updateUserActiveStatus";

const DEBUG = true;
const LEVEL_INCOME_RATES = [0.05, 0.04, 0.03, 0.02, 0.01]; // 5 levels

function log(...x) {
  if (DEBUG) console.log("🟡 [APPROVE-DEBUG]:", ...x);
}

export async function POST(req) {
  try {
    log("API HIT");

    const body = await req.json().catch(() => null);
    const id = Number(body?.id || body?.depositId);

    if (!id) return Response.json({ error: "depositId missing" }, { status: 400 });

    const deposit = await prisma.deposit.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!deposit) return Response.json({ error: "Deposit not found" }, { status: 400 });
    if (deposit.status !== "pending")
      return Response.json({ error: "Already processed" }, { status: 400 });

    const userId = deposit.userId;
    const amount = deposit.amount;

    // ADMIN
    const admin = await prisma.admin.findFirst();
    if (!admin) return Response.json({ error: "Admin not found" }, { status: 500 });

    // 1) APPROVE
    await prisma.deposit.update({ where: { id }, data: { status: "approved" } });
    log("✔ Deposit Approved");

    // 2) WALLET
    await prisma.wallet.update({
      where: { userId },
      data: { mainWallet: { increment: amount } },
    });

    // 3) APPROVED LOG
    await prisma.approvedDeposit.create({
      data: { userId, amount, trxId: deposit.trxId },
    });

    // 4) HISTORY (fixed processedBy)
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

    // 5) AUTO ACTIVATE
    const usr = await prisma.user.findUnique({
      where: { id: userId },
      select: { isActive: true },
    });

    if (!usr.isActive) {
      await prisma.user.update({ where: { id: userId }, data: { isActive: true } });
      await openActiveHistory(userId, "Deposit approved → activated");
    }

    // 6) INSTANT ROI
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

    // -------------------------
    // 7) LEVEL INCOME (5 Levels)
    // -------------------------
    let upline = deposit.user.referredBy;
    let level = 0;

    while (upline && level < 5) {
      const rate = LEVEL_INCOME_RATES[level]; // NEW RATE FIX
      const commission = Number((instantRoi * rate).toFixed(2));

      const parent = await prisma.user.findUnique({
        where: { id: upline },
        select: { isActive: true, isBlocked: true, isSuspended: true },
      });

      if (parent?.isActive && !parent.isBlocked && !parent.isSuspended) {
        await prisma.wallet.update({
          where: { userId: upline },
          data: { levelWallet: { increment: commission } },
        });

        await prisma.roiLevelIncome.create({
          data: {
            userId: upline,
            fromUserId: userId,
            level: level + 1,
            amount: commission,
          },
        });
      }

      const next = await prisma.user.findUnique({
        where: { id: upline },
        select: { referredBy: true },
      });

      upline = next?.referredBy;
      level++;
    }

    // 8) FINAL STATUS RECHECK
    await updateUserActiveStatus(userId);

    return Response.json({ success: true });
  } catch (err) {
    console.error("❌ Approve ERROR DEBUG:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
