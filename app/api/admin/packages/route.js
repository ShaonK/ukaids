import prisma from "@/lib/prisma";
import { getAdmin } from "@/lib/getAdmin";
import { NextResponse } from "next/server";

export async function GET() {
  const admin = await getAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const packages = await prisma.package.findMany({
    orderBy: { position: "asc" },
  });

  return NextResponse.json(packages);
}

export async function POST(req) {
  const admin = await getAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { packageId } = await req.json();

  await prisma.package.update({
    where: { id: Number(packageId) },
    data: { isActive: true },
  });

  return NextResponse.json({ success: true });
}
