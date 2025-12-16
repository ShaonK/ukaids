// app/api/user/withdraw/route.js
import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";

export async function POST(req) {
  try {
    const user = await getUser();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount } = await req.json();
    const withdrawAmount = Number(amount);

    if (!withdrawAmount || withdrawAmount <= 0) {
      return Response.json({ error: "Invalid amount" }, { status: 400 });
    }

    // 🔒 Check existing pending withdraw
    const existing = await prisma.withdrawRequest.findFirst({
      where: {
        userId: user.id,
        status: "pending",
      },
    });

    if (existing) {
      return Response.json(
        { error: "You already have a pending withdraw request" },
        { status: 400 }
      );
    }

    // 🔍 Wallet check
    const wallet = await prisma.wallet.findUnique({
      where: { userId: user.id },
    });

    if (!wallet || wallet.mainWallet < withdrawAmount) {
      return Response.json(
        { error: "Insufficient balance" },
        { status: 400 }
      );
    }

    // 🔍 Withdraw address check
    const address = await prisma.withdrawAddress.findUnique({
      where: { userId: user.id },
    });

    if (!address) {
      return Response.json(
        { error: "Withdraw address not set" },
        { status: 400 }
      );
    }

    // ✅ Create withdraw request (NO debit here)
    await prisma.withdrawRequest.create({
      data: {
        userId: user.id,
        amount: withdrawAmount,
        address: address.address,
        network: address.network,
        status: "pending",
      },
    });

    return Response.json({
      success: true,
      message: "Withdraw request submitted successfully",
    });

  } catch (err) {
    console.error("USER WITHDRAW ERROR:", err);
    return Response.json({ error: "Withdraw failed" }, { status: 500 });
  }
}
