import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";
import { debitWallet, creditWallet } from "@/lib/walletService";

export async function POST(req) {
  try {
    const sender = await getUser();
    if (!sender) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 🔒 Sender eligibility
    if (sender.isBlocked || sender.isSuspended || !sender.isActive) {
      return Response.json(
        { error: "Your account is not eligible for transfer" },
        { status: 403 }
      );
    }

    const { receiver, amount } = await req.json();
    const transferAmount = Number(amount);

    if (!receiver || transferAmount <= 0) {
      return Response.json(
        { error: "Invalid transfer data" },
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
    });

    if (!receiverUser) {
      return Response.json({ error: "Receiver not found" }, { status: 404 });
    }

    if (receiverUser.id === sender.id) {
      return Response.json(
        { error: "Self transfer not allowed" },
        { status: 400 }
      );
    }

    if (receiverUser.isBlocked || receiverUser.isSuspended) {
      return Response.json(
        { error: "Receiver account is not eligible" },
        { status: 403 }
      );
    }

    // 🔁 INSTANT TRANSFER (NO ADMIN)
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

      // 📄 Save history as APPROVED
      await tx.balanceTransfer.create({
        data: {
          senderId: sender.id,
          receiverId: receiverUser.id,
          amount: transferAmount,
          status: "APPROVED",
          packageId: null,
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
