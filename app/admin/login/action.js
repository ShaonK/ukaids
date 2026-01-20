"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export default async function adminLoginAction(formData) {
  try {
    const username = formData.get("username");
    const password = formData.get("password");

    if (!username || !password) {
      return { error: "Username & password required" };
    }

    const admin = await prisma.admin.findUnique({
      where: { username },
      select: {
        id: true,
        password: true,
      },
    });

    if (!admin) {
      return { error: "Admin not found!" };
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return { error: "Wrong password!" };
    }

    // ✅ JWT stores ADMIN ID (not user id)
    const token = jwt.sign(
      {
        adminId: admin.id,
        role: "admin",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const cookieStore = await cookies();
    cookieStore.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return { success: true };
  } catch (err) {
    console.error("ADMIN LOGIN ERROR:", err);
    return { error: "Login failed" };
  }
}
