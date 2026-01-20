import prisma from "@/lib/prisma";
import { getAdmin } from "@/lib/getAdmin";

export async function POST(req) {
  const admin = await getAdmin();
  if (!admin) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId, walletType, amount, note } = await req.json();
  const amt = Number(amount);

  if (!userId || !walletType || amt <= 0) {
    return Response.json({ error: "Invalid data" }, { status: 400 });
  }

  const wallet = await prisma.wallet.findUnique({
    where: { userId },
  });

  if (!wallet || wallet[walletType] < amt) {
    return Response.json(
      { error: "Insufficient balance" },
      { status: 400 }
    );
  }

  await prisma.$transaction([
    prisma.wallet.update({
      where: { userId },
      data: {
        [walletType]: { decrement: amt },
      },
    }),

    prisma.walletTransaction.create({
      data: {
        userId,
        walletType,
        direction: "OUT",
        amount: amt,
        source: "ADMIN_DEDUCT",
        note,
        balanceBefore: wallet[walletType],
        balanceAfter: wallet[walletType] - amt,
      },
    }),
  ]);

  return Response.json({ success: true });
}
