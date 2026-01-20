import prisma from "@/lib/prisma";
import { getAdmin } from "@/lib/getAdmin";

export async function POST(req) {
  try {
    const admin = await getAdmin();
    if (!admin) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { transactionId } = await req.json();
    const txId = Number(transactionId);

    if (!txId) {
      return Response.json(
        { error: "Invalid transactionId" },
        { status: 400 }
      );
    }

    await prisma.$transaction(async (tx) => {
      const txRow = await tx.walletTransaction.findUnique({
        where: { id: txId },
      });

      if (!txRow) throw new Error("Transaction not found");
      if (txRow.reversed) throw new Error("Already reversed");

      // 🔁 Restore wallet balance
      await tx.wallet.update({
        where: { userId: txRow.userId },
        data: {
          [txRow.walletType]: { increment: txRow.amount },
        },
      });

      // 🔄 Mark transaction reversed
      await tx.walletTransaction.update({
        where: { id: txId },
        data: {
          reversed: true,
          reversedBy: admin.id, // admin table id (ok)
          reversedAt: new Date(),
        },
      });

      // 🧾 Audit log (CRITICAL FIX)
     
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error("REVERSE ERROR:", err);
    return Response.json(
      { error: err.message || "Reverse failed" },
      { status: 500 }
    );
  }
}
