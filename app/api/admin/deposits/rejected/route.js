// app/api/admin/deposits/rejected/route.js
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const list = await prisma.rejectedDeposit.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(list);
  } catch (err) {
    console.error("rejected deposits GET error:", err);
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}
