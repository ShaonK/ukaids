import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";
import { debitWallet, creditWallet } from "@/lib/walletService";

const MIN_TRANSFER_AMOUNT = 5;

export async function POST(req) {
  try {
    // 🔐 Auth
    const sender = await getUser();
    if (!sender) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 🔒 Sender eligibility
    if (sender.isBlocked || sender.isSuspended || !sender.isActive) {
      return Response.json(
        { error: "Your account is not eligible for transfer" },
        { status: 403 }
      );
    }

    // 📥 Input
    const { receiver, amount } = await req.json();
    const transferAmount = Number(Number(amount).toFixed(6));

    if (!receiver || transferAmount <= 0) {
      return Response.json(
        { error: "Invalid transfer data" },
        { status: 400 }
      );
    }

    if (transferAmount < MIN_TRANSFER_AMOUNT) {
      return Response.json(
        {
          error: `Minimum transfer amount is $${MIN_TRANSFER_AMOUNT}`,
        },
        { status: 400 }
      );
    }

    // 🔍 Find receiver
    const receiverUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username: receiver },
          { id: Number(receiver) || -1 },
        ],
      },
      select: {
        id: true,
        username: true,
        isBlocked: true,
        isSuspended: true,
      },
    });

    if (!receiverUser) {
      return Response.json(
        { error: "Receiver not found" },
        { status: 404 }
      );
    }

    // ❌ Self transfer
    if (receiverUser.id === sender.id) {
      return Response.json(
        { error: "Self transfer is not allowed" },
        { status: 400 }
      );
    }

    // 🔒 Receiver eligibility
    if (receiverUser.isBlocked || receiverUser.isSuspended) {
      return Response.json(
        { error: "Receiver account is not eligible" },
        { status: 403 }
      );
    }

    // 🔁 ATOMIC TRANSFER
    await prisma.$transaction(async (tx) => {
      // ➖ Debit sender
      await debitWallet({
        tx,
        userId: sender.id,
        walletType: "ACCOUNT",
        amount: transferAmount,
        source: "TRANSFER_OUT",
        note: `Transfer to ${receiverUser.username}`,
      });

      // ➕ Credit receiver
      await creditWallet({
        tx,
        userId: receiverUser.id,
        walletType: "ACCOUNT",
        amount: transferAmount,
        source: "TRANSFER_IN",
        note: `Transfer from ${sender.username}`,
      });

      // 📄 History
      await tx.balanceTransfer.create({
        data: {
          senderId: sender.id,
          receiverId: receiverUser.id,
          amount: transferAmount,
          status: "APPROVED",
        },
      });
    });

    return Response.json({
      success: true,
      message: "Balance transferred successfully",
    });

  } catch (err) {
    console.error("TRANSFER ERROR:", err);
    return Response.json(
      { error: err.message || "Transfer failed" },
      { status: 500 }
    );
  }
}
