import prisma from "@/lib/prisma";

export async function GET() {
    const list = await prisma.rejectedDeposit.findMany({
        include: { user: true },
        orderBy: { createdAt: "desc" }
    });

    return Response.json(list);
}
