import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const list = await prisma.approvedDeposit.findMany({
            orderBy: { id: "desc" },
            include: {
                user: true,  // ⭐ IMPORTANT → join user table
            },
        });

        return Response.json(list);
    } catch (error) {
        return Response.json({ error: "Server error" }, { status: 500 });
    }
}
