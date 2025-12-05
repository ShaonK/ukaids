"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export default async function adminLoginAction(formData) {
    const username = formData.get("username");
    const password = formData.get("password");

    const admin = await prisma.admin.findUnique({
        where: { username },
    });

    if (!admin) {
        return { error: "Admin Not Found!" };
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
        return { error: "Wrong Password!" };
    }

    const token = jwt.sign(
        { id: admin.id, role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    const cookieStore = await cookies();
    cookieStore.set("admin_token", token, {
        httpOnly: true,
        secure: false,
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
    });

    return { success: true };
}
