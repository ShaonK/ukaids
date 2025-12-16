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
       CAPTCHA VALIDATION
    -------------------- */
    if (!captchaAnswer || captchaAnswer !== captchaSum) {
      return { error: "Invalid captcha!" };
    }

    /* --------------------
       USER CHECK
    -------------------- */
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return { error: "User not found!" };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { error: "Wrong password!" };
    }

    if (user.isBlocked) {
      return { error: "Account blocked!" };
    }

    /* --------------------
       JWT TOKEN
    -------------------- */
    const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

    const token = await new SignJWT({
      id: user.id,
      username: user.username,
      isBlocked: user.isBlocked,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(SECRET);

    /* --------------------
       SET COOKIE
    -------------------- */
    const cookieStore = cookies();
    cookieStore.set("token", token, {
      httpOnly: false, // client-side access needed
      sameSite: "lax",
      secure: false,  // true in production (https)
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return { success: true };

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return { error: "Login failed. Try again later." };
  }
}
