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
        where: { username },
    });

    if (!user) return { error: "User not found!" };

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return { error: "Wrong Password!" };

    if (user.isBlocked) return { error: "Account Blocked!" };

    const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

    const token = await new SignJWT({
        id: user.id,
        username: user.username,
        isBlocked: user.isBlocked,
    })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("7d")
        .sign(SECRET);

    // ✔ Correct Cookie Settings
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
        httpOnly: false,      // CLIENT থেকে পড়তে হবে → httpOnly=false দরকার
        sameSite: "lax",
        secure: false,
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
    });

    return { success: true };
}
