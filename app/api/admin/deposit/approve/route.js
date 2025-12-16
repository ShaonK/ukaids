// app/api/admin/deposit/approve/route.js
import prisma from "@/lib/prisma";
import { creditWallet } from "@/lib/walletService";

export async function POST(req) {
  try {
    const body = await req.json().catch(() => null);
    const id = Number(body?.id || body?.depositId);

    if (!id) {
      return Response.json({ error: "Recharge ID missing" }, { status: 400 });
    }

    const recharge = await prisma.deposit.findUnique({
      where: { id },
    });

    if (!recharge || recharge.status !== "pending") {
      return Response.json(
        { error: "Invalid or processed recharge" },
        { status: 400 }
      );
    }

    const admin = await prisma.admin.findFirst();
    if (!admin) {
      return Response.json({ error: "Admin missing" }, { status: 500 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.deposit.update({
        where: { id },
        data: { status: "approved" },
      });

      await creditWallet({
        userId: recharge.userId,
        walletType: "ACCOUNT",
        amount: recharge.amount,
        source: "RECHARGE_APPROVE",
        referenceId: id,
        note: `Account recharge approved (trx: ${recharge.trxId})`,
      });

      await tx.approvedDeposit.create({
        data: {
          userId: recharge.userId,
          amount: recharge.amount,
          trxId: recharge.trxId,
        },
      });

      await tx.depositHistory.create({
        data: {
          userId: recharge.userId,
          depositId: id,
          amount: recharge.amount,
          trxId: recharge.trxId,
          status: "recharge_approved",
          processedBy: admin.id,
        },
      });
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error("❌ RECHARGE APPROVE ERROR:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
