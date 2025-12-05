import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";

export async function POST(req) {
    try {
        const user = await getUser();
        if (!user) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { amount, trxId } = body;

        if (!amount || !trxId) {
            return Response.json(
                { error: "Amount & TRX ID required!" },
                { status: 400 }
            );
        }

        // Create deposit request
        await prisma.deposit.create({
            data: {
                userId: user.id,
                amount: parseFloat(amount),
                trxId,
            },
        });

        return Response.json({ success: true });
    } catch (err) {
        console.error("DEPOSIT API ERROR:", err);
        return Response.json(
            { error: "Server Error" },
            { status: 500 }
        );
    }
}
