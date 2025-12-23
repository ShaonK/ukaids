// app/api/admin/auth/forgot-password/route.js
import prisma from "@/lib/prisma";
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { username } = await req.json();

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    // 🔎 Find admin (case-insensitive)
    const admin = await prisma.admin.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
    });

    if (!admin) {
      return NextResponse.json(
        { error: "Admin not found" },
        { status: 404 }
      );
    }

    // 🔐 Generate secure token
    const token = crypto.randomBytes(32).toString("hex");

    // ⏳ Expiry: 15 minutes
    const expiresAt = new Date(
      Date.now() + 15 * 60 * 1000
    );

    // 🔄 Optional: delete old tokens for this admin
    await prisma.adminPasswordReset.deleteMany({
      where: { adminId: admin.id },
    });

    // 💾 Save token
    await prisma.adminPasswordReset.create({
      data: {
        adminId: admin.id,
        token,
        expiresAt,
      },
    });

    // ⚠️ NOTE:
    // Production-এ token email / sms করা উচিত
    // এখন UI button flow-এর জন্য response-এ পাঠানো হচ্ছে

    return NextResponse.json({
      success: true,
      token, // 🔥 REQUIRED FOR FRONTEND BUTTON FLOW
      message: "Reset link generated successfully",
    });

  } catch (err) {
    console.error("❌ FORGOT PASSWORD ERROR:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
