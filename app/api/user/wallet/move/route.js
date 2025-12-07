import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";

export async function POST(req) {
    try {
        const user = await getUser();
        const { moveFrom, amount } = await req.json();

        const wallet = await prisma.wallet.findUnique({
            where: { userId: user.id },
        });

        if (!wallet) return Response.json({ error: "Wallet not found" });

        if (wallet[moveFrom] < Number(amount)) {
            return Response.json({ error: "Insufficient balance" });
        }

        await prisma.wallet.update({
            where: { userId: user.id },
            data: {
                [moveFrom]: { decrement: Number(amount) },
                mainWallet: { increment: Number(amount) },
            },
        });

        return Response.json({ success: true });
    } catch {
        return Response.json({ error: "Server Error" });
    }
}
