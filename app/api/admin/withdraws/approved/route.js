import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const list = await prisma.approvedWithdraw.findMany({
            orderBy: { id: "desc" },
            include: {
                user: true,  // ⭐ username, fullname return করবে
            }
        });

        return Response.json(list);
    } catch (err) {
        console.log("Approved withdraw fetch error:", err);
        return Response.json({ error: "Server error" }, { status: 500 });
    }
}
