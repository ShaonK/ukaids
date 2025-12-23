import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { token, password } = await req.json();

  const record = await prisma.adminPasswordReset.findUnique({
    where: { token },
    include: { admin: true },
  });

  if (!record || record.expiresAt < new Date()) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 400 }
    );
  }

  const hash = await bcrypt.hash(password, 10);

  await prisma.$transaction(async (tx) => {
    await tx.admin.update({
      where: { id: record.adminId },
      data: { password: hash },
    });

    await tx.adminPasswordReset.delete({
      where: { id: record.id },
    });
  });

  return NextResponse.json({
    success: true,
    message: "Password reset successful",
  });
}
