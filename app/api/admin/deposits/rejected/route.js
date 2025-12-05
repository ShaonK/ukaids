import prisma from "@/lib/prisma";

export async function GET() {
    const data = await prisma.rejectedDeposit.findMany({
        orderBy: { id: "desc" }
    });

    return Response.json(data);
}
