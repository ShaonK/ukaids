import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";

export async function POST(req) {
    try {
        const user = await getUser();
        const { amount } = await req.json();

        if (!amount || amount <= 0) {
            return Response.json({ error: "Invalid amount" }, { status: 400 });
        }

        // Wallet find
        const wallet = await prisma.wallet.findUnique({
            where: { userId: user.id },
        });

        if (!wallet) return Response.json({ error: "Wallet not found" });

        if (wallet.mainWallet < Number(amount)) {
            return Response.json({ error: "Insufficient main wallet balance" }, { status: 400 });
        }

        // 1️⃣ Decrease Main Wallet
        await prisma.wallet.update({
            where: { userId: user.id },
            data: {
                mainWallet: { decrement: Number(amount) },
            },
        });

        // 2️⃣ Create Withdraw Request
        const withdraw = await prisma.withdraw.create({
            data: {
                userId: user.id,
                amount: Number(amount),
                walletType: "mainWallet",  // ⭐ FIXED
                status: "pending",
            },
        });

        return Response.json({ success: true, withdraw });
    } catch (err) {
        console.log("Withdraw Error:", err);
        return Response.json({ error: "Server Error" }, { status: 500 });
    }
}
