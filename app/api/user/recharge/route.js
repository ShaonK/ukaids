import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";

export async function POST(req) {
    try {
        const user = await getUser();
        if (!user) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { amount, trxId } = await req.json();

        if (!amount || !trxId) {
            return Response.json(
                { error: "Amount and transaction ID required" },
                { status: 400 }
            );
        }

        await prisma.deposit.create({
            data: {
                userId: user.id,
                amount: Number(amount),
                trxId,
                status: "pending",
            },
        });

        return Response.json({
            success: true,
            message: "Recharge request submitted",
        });

    } catch (err) {
        console.error("USER RECHARGE ERROR:", err);
        return Response.json({ error: "Server error" }, { status: 500 });
    }
}
