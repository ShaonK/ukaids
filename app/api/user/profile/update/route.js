import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";

export async function POST(req) {
    const user = await getUser();
    if (!user) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    await prisma.user.update({
        where: { id: user.id },
        data: {
            name: body.name,
            phone: body.phone,
            country: body.country,
        },
    });

    return Response.json({ success: true });
}
