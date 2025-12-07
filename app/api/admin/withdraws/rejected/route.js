import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const list = await prisma.rejectedWithdraw.findMany({
            orderBy: { id: "desc" },
            include: {
                user: true,
            }
        });

        return Response.json(list);
    } catch (err) {
        console.log("Rejected withdraw fetch error:", err);
        return Response.json({ error: "Server error" }, { status: 500 });
    }
}
