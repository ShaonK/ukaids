import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";

export async function GET() {
    const user = await getUser();
    if (!user) return Response.json({ items: [] });

    const rows = await prisma.withdrawRequest.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
    });

    return Response.json({
        items: rows.map(w => ({
            id: w.id,
            amount: Number(w.amount),
            commission: Number(w.commission),
            netAmount: Number(w.netAmount),
            status: w.status.toUpperCase(),
            createdAt: w.createdAt,
        })),
    });
}
