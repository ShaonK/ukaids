"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { SignJWT } from "jose";

export default async function loginAction(formData) {
    const username = formData.get("username");
    const password = formData.get("password");
    const captcha = formData.get("captcha");

    if (!captcha || captcha !== "1234") {
        return { error: "Invalid Captcha!" };
    }

    const user = await prisma.user.findUnique({
        where: { username }
    });

    if (!user) return { error: "User not found!" };

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return { error: "Wrong Password!" };

    // BLOCK CHECK
    if (user.isBlocked) {
        return { error: "Account Blocked!" };
    }

    // ⬇️ JWT CREATE (CORRECT WAY)
    const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

    const token = await new SignJWT({
        id: user.id,
        username: user.username,
        isBlocked: user.isBlocked,
    })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("7d")
        .sign(SECRET);

    const cookieStore = await cookies();
    cookieStore.set("token", token, {
        httpOnly: true,
        secure: false,
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
    });

    return { success: true };
}
