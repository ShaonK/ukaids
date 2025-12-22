import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      fullname: true,
      username: true,
      email: true,
      mobile: true,
      referralCode: true,
      createdAt: true,
    },
  });

  return NextResponse.json(profile);
}
