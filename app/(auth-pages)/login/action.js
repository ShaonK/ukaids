"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export default async function loginAction(formData) {
    const username = formData.get("username");
    const password = formData.get("password");
    const captcha = formData.get("captcha");

    console.log("FORM DATA USERNAME:", username);
    console.log("FORM DATA PASSWORD:", password);

    // Captcha Check
    if (!captcha || captcha !== "1234") {
        return { error: "Invalid Captcha!" };
    }

    // Find User
    const user = await prisma.user.findUnique({
        where: { username },
    });

    if (!user) {
        return { error: "User not found!" };
    }

    // DEBUG → Compare before checking ------------------------
    console.log("INPUT PASSWORD:", password);
    console.log("HASHED PASSWORD:", user.password);

    const isMatch = await bcrypt.compare(password, user.password);

    console.log("COMPARE RESULT:", isMatch);
    //---------------------------------------------------------

    if (!isMatch) {
        return { error: "Wrong Password!" };
    }

    if (user.isBlocked) {
        return { error: "Account Blocked!" };
    }

    // JWT Token Issue
    const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    const cookieStore = await cookies();
    cookieStore.set("token", token, {
        httpOnly: true,
        secure: false,
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
    });

    return { success: true };
}
