import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";

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

    if (!receiver || !transferAmount || transferAmount <= 0) {
      return Response.json(
        { error: "Invalid transfer data" },
        { status: 400 }
      );
    }

    // 🔍 Find receiver (username OR userId)
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

    /**
     * 🚨 IMPORTANT CHANGE
     * No wallet debit / credit here
     * Only create a PENDING transfer request
     */

    await prisma.balanceTransfer.create({
      data: {
        senderId: sender.id,
        receiverId: receiverUser.id,
        amount: transferAmount,
        packageId: null, // account balance transfer
        // status will be handled by admin approval
      },
    });

    return Response.json({
      success: true,
      message: "Transfer request submitted. Waiting for admin approval.",
    });

  } catch (err) {
    console.error("TRANSFER REQUEST ERROR:", err);
    return Response.json(
      { error: err.message || "Transfer request failed" },
      { status: 500 }
    );
  }
}
