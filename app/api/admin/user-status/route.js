import prisma from "@/lib/prisma";

export async function POST(req) {
    const body = await req.json();
    const { userId, isBlocked } = body;

    try {
        await prisma.user.update({
            where: { id: userId },
            data: { isBlocked },
        });

        return Response.json({ success: true });
    } catch (e) {
        return Response.json({ error: "Update failed" }, { status: 500 });
    }
}
