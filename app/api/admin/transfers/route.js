import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const transfers = await prisma.balanceTransfer.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                sender: { select: { username: true } },
                receiver: { select: { username: true } },
            },
        });

        const items = transfers.map((t) => ({
            id: t.id,
            sender: t.sender.username,
            receiver: t.receiver.username,
            amount: t.amount,
            status: t.status,
            createdAt: t.createdAt,
        }));

        return Response.json({ items });
    } catch (err) {
        console.error("ADMIN TRANSFER LIST ERROR:", err);
        return Response.json(
            { error: "Failed to load transfers" },
            { status: 500 }
        );
    }
}
