import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";
import { debitWallet } from "@/lib/walletService";

export async function POST(req) {
  try {
    const user = await getUser();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const withdrawAmount = Number(body.amount);
    const address = body.address?.trim();
    const network = body.network?.trim();

    // ✅ STRICT VALIDATION
    if (
      !withdrawAmount ||
      withdrawAmount <= 0 ||
      !address ||
      !network
    ) {
      return Response.json(
        { error: "Amount, address and network are required" },
        { status: 400 }
      );
    }

    await prisma.$transaction(async (tx) => {
      // 🔴 Cut balance immediately (ONCE)
      await debitWallet({
        tx,
        userId: user.id,
        walletType: "ACCOUNT",
        amount: withdrawAmount,
        source: "WITHDRAW_REQUEST",
        note: "Withdraw request submitted",
      });

      // 🟡 Create withdraw request
      await tx.withdrawRequest.create({
        data: {
          userId: user.id,
          amount: withdrawAmount,
          address,
          network,
          status: "pending",
        },
      });
    });

    return Response.json({
      success: true,
      message: "Withdraw request submitted successfully",
    });

  } catch (err) {
    console.error("WITHDRAW ERROR:", err);
    return Response.json(
      { error: err.message || "Withdraw failed" },
      { status: 500 }
    );
  }
}
