import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";

export async function GET() {
    try {
        const user = await getUser();
        if (!user) {
            return Response.json({ items: [] }, { status: 401 });
        }

        const transfers = await prisma.balanceTransfer.findMany({
            where: {
                OR: [
                    { senderId: user.id },
                    { receiverId: user.id },
                ],
            },
            orderBy: {
                createdAt: "desc",
            },
            include: {
                sender: {
                    select: {
                        username: true,
                    },
                },
                receiver: {
                    select: {
                        username: true,
                    },
                },
            },
        });

        const items = transfers.map((t) => {
            const isSender = t.senderId === user.id;

            return {
                id: t.id,
                direction: isSender ? "OUT" : "IN",
                user: isSender ? t.receiver.username : t.sender.username,
                amount: t.amount,
                status: t.status || "PENDING", // future-safe
                createdAt: t.createdAt,
            };
        });

        return Response.json({ items });

    } catch (err) {
        console.error("TRANSFER HISTORY ERROR:", err);
        return Response.json(
            { error: "Failed to load transfer history" },
            { status: 500 }
        );
    }
}
