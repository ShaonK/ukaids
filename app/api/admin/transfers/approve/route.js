import prisma from "@/lib/prisma";
import { debitWallet, creditWallet } from "@/lib/walletService";

export async function POST(req) {
    try {
        const { id } = await req.json();
        if (!id) {
            return Response.json({ error: "Transfer ID required" }, { status: 400 });
        }

        await prisma.$transaction(async (tx) => {
            const transfer = await tx.balanceTransfer.findUnique({
                where: { id },
                include: {
                    sender: true,
                    receiver: true,
                },
            });

            if (!transfer) {
                throw new Error("Transfer not found");
            }

            if (transfer.status !== "PENDING") {
                throw new Error("Transfer already processed");
            }

            // 🔁 Debit sender
            await debitWallet({
                tx,
                userId: transfer.senderId,
                walletType: "ACCOUNT",
                amount: transfer.amount,
                source: "TRANSFER_OUT",
                referenceId: transfer.id,
                note: `Transfer to ${transfer.receiver.username}`,
            });

            // 🔁 Credit receiver
            await creditWallet({
                tx,
                userId: transfer.receiverId,
                walletType: "ACCOUNT",
                amount: transfer.amount,
                source: "TRANSFER_IN",
                referenceId: transfer.id,
                note: `Transfer from ${transfer.sender.username}`,
            });

            // ✅ Mark approved
            await tx.balanceTransfer.update({
                where: { id },
                data: { status: "APPROVED" },
            });
        });

        return Response.json({
            success: true,
            message: "Transfer approved successfully",
        });

    } catch (err) {
        console.error("TRANSFER APPROVE ERROR:", err);
        return Response.json(
            { error: err.message || "Approve failed" },
            { status: 500 }
        );
    }
}
