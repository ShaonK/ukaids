import prisma from "@/lib/prisma";
import { getAdmin } from "@/lib/getAdmin";
import { Prisma } from "@prisma/client";

export async function POST(req) {
  const admin = await getAdmin();
  if (!admin) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { transactionId } = await req.json();

  const tx = await prisma.walletTransaction.findUnique({
    where: { id: transactionId },
  });

  if (!tx || tx.reversed || tx.source !== "ADMIN_GIFT") {
    return Response.json({ error: "Invalid transaction" }, { status: 400 });
  }

  const wallet = await prisma.wallet.findUnique({
    where: { userId: tx.userId },
  });

  const before = new Prisma.Decimal(wallet.donationWallet);
  const after = before.minus(new Prisma.Decimal(tx.amount));

  await prisma.$transaction([
    prisma.wallet.update({
      where: { userId: tx.userId },
      data: {
        donationWallet: after,
      },
    }),

    prisma.walletTransaction.update({
      where: { id: tx.id },
      data: {
        reversed: true,
        reversedBy: admin.id,
        reversedAt: new Date(),
      },
    }),

    prisma.adminAuditLog.create({
      data: {
        adminId: admin.id,
        action: "UNDO_ADMIN_GIFT",
        targetType: "WALLET_TX",
        targetId: tx.id,
        oldValue: { donationWallet: before.toString() },
        newValue: { donationWallet: after.toString() },
      },
    }),
  ]);

  return Response.json({ success: true });
}
