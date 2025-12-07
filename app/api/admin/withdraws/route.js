import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const withdraws = await prisma.withdraw.findMany({
            where: { status: "pending" },
            orderBy: { id: "desc" },
            include: { user: true }
        });

        return new Response(JSON.stringify(withdraws));
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
