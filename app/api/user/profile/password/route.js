import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getUser } from "@/lib/getUser";

export async function POST(req) {
    const user = await getUser();
    if (!user) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { oldPassword, newPassword } = await req.json();

    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) {
        return Response.json({ error: "Wrong password" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
        where: { id: user.id },
        data: { password: hashed },
    });

    return Response.json({ success: true });
}
