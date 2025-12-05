import prisma from "@/lib/prisma";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";

    const users = await prisma.user.findMany({
        where: {
            OR: [
                { username: { contains: q } },
                { mobile: { contains: q } },
            ],
        },
        select: {
            id: true,
            username: true,
            mobile: true,
            email: true,
            referralCode: true,
            isBlocked: true,
            createdAt: true,
        },
        orderBy: { id: "desc" },
    });

    return Response.json(users);
}
