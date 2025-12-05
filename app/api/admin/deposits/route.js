import prisma from "@/lib/prisma";

export async function GET() {
    const deposits = await prisma.deposit.findMany({
        orderBy: { id: "desc" },
        include: {
            user: {
                select: { username: true, mobile: true }
            }
        }
    });

    return Response.json(deposits);
}
