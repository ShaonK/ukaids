"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { SignJWT } from "jose";

export default async function loginAction(formData) {
  try {
    const username = formData.get("username");
    const password = formData.get("password");
    const captchaAnswer = Number(formData.get("captchaAnswer"));
    const captchaSum = Number(formData.get("captchaSum"));

    /* --------------------
       CAPTCHA CHECK
    -------------------- */
    if (captchaAnswer !== captchaSum) {
      return { error: "Invalid captcha" };
    }

    /* --------------------
       USER CHECK
    -------------------- */
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) return { error: "User not found" };
    if (user.isBlocked) return { error: "Account blocked" };

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return { error: "Wrong password" };

    /* --------------------
       JWT GENERATE
    -------------------- */
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const token = await new SignJWT({
      id: user.id,
      username: user.username,
      isBlocked: user.isBlocked,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);

    /* --------------------
       ✅ NEXT.JS 16 FIX
       cookies() IS ASYNC
    -------------------- */
    const cookieStore = await cookies();

    cookieStore.set("token", token, {
      httpOnly: false, // client-side access needed
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return { success: true };
  } catch (err) {
    console.error("LOGIN ACTION ERROR:", err);
    return { error: "Login failed" };
  }
}
