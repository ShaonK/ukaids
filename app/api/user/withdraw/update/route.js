// app/api/user/withdraw/update/route.js
import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";

export async function POST(req) {
    try {
        const user = await getUser();
        if (!user) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id, amount } = await req.json();

        if (!id || !amount || amount <= 0) {
            return Response.json(
                { error: "Invalid withdraw data" },
                { status: 400 }
            );
        }

        const withdraw = await prisma.withdrawRequest.findUnique({
            where: { id },
        });

        if (!withdraw) {
            return Response.json(
                { error: "Withdraw not found" },
                { status: 404 }
            );
        }

        // 🔐 Ownership check
        if (withdraw.userId !== user.id) {
            return Response.json(
                { error: "Forbidden" },
                { status: 403 }
            );
        }

        // ❌ Only pending allowed
        if (withdraw.status !== "pending") {
            return Response.json(
                { error: "Withdraw already processed" },
                { status: 400 }
            );
        }

        // 💰 Balance check (still not debited)
        if (user.wallet.mainWallet < amount) {
            return Response.json(
                { error: "Insufficient balance" },
                { status: 400 }
            );
        }

        await prisma.withdrawRequest.update({
            where: { id },
            data: {
                amount: Number(amount),
                updatedAt: new Date(),
            },
        });

        return Response.json({ success: true });

    } catch (err) {
        console.error("WITHDRAW UPDATE ERROR:", err);
        return Response.json(
            { error: "Update failed" },
            { status: 500 }
        );
    }
}
