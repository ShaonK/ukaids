import prisma from "@/lib/prisma";

export async function GET() {
    const withdraws = await prisma.withdraw.findMany({
        orderBy: { id: "desc" },
        include: {
            user: {
                select: { username: true, mobile: true }
            }
        }
    });

    return Response.json(withdraws);
}
