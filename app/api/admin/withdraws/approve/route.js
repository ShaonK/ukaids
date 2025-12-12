// app/api/admin/withdraws/approve/route.js
import prisma from "@/lib/prisma";
import { updateUserActiveStatus, closeActiveHistory } from "@/lib/updateUserActiveStatus";

export async function POST(req) {
  try {
    const { id } = await req.json();

    const withdraw = await prisma.withdraw.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!withdraw)
      return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });

    if (withdraw.status !== "pending") {
      return new Response(JSON.stringify({ error: "Already processed" }), { status: 400 });
    }

    const userId = withdraw.userId;
    const amount = withdraw.amount;

    await prisma.$transaction(async (tx) => {
      // -------------------------------------------
      // 1) Approve Withdraw
      // -------------------------------------------
      await tx.withdraw.update({
        where: { id },
        data: { status: "approved" },
      });

      // -------------------------------------------
      // 2) Add Approved Withdraw Record
      // -------------------------------------------
      await tx.approvedWithdraw.create({
        data: {
          userId,
          amount,
          walletType: withdraw.walletType,
        },
      });

      // -------------------------------------------
      // 3) Deduct From Wallet (Selected Wallet)
      // -------------------------------------------
      await tx.wallet.update({
        where: { userId },
        data: {
          [withdraw.walletType]: { decrement: amount },
        },
      });
    });

    // -------------------------------------------
    // 4) After Withdraw → Check Active Status
    // -------------------------------------------
    const becameInactive = await updateUserActiveStatus(userId);

    // if user turned inactive now → close active history session
    if (becameInactive) {
      await closeActiveHistory(userId, "Withdraw → wallet empty/inactive condition met");
    }

    return new Response(JSON.stringify({ success: true }));
  } catch (e) {
    console.error("Withdraw Approve ERROR:", e);
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
