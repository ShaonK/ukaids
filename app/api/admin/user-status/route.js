export const runtime = "nodejs";

import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(req) {
    const { userId, isBlocked } = await req.json();

    try {
        await prisma.user.update({
            where: { id: userId },
            data: { isBlocked },
        });

        // ❗ user টিকে force logout করানো হচ্ছে
        const cookieStore = await cookies();
        cookieStore.delete("token");

        return Response.json({ success: true });
    } catch (e) {
        return Response.json({ error: "Update failed" }, { status: 500 });
    }
}
