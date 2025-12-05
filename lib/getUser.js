import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import prisma from "./prisma";

export async function getUser() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) return null;

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            include: {
                wallet: true,
            },
        });

        return user;
    } catch (err) {
        console.error("getUser() ERROR:", err);
        return null;
    }
}
