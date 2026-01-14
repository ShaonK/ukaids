import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { VipRank } from "@prisma/client";

export async function POST(req) {
  try {
    const { userId, rank, adminId, enabled } = await req.json();

    if (!userId || !adminId) {
      return NextResponse.json({ success: false }, { status: 400 });
    }

    if (enabled) {
      // 🟢 ASSIGN
      await prisma.$transaction([
        prisma.userRank.upsert({
          where: { userId },
          update: {
            rank,
            assignedByAdmin: true,
            achievedAt: new Date(),
            salaryStartAt: new Date(),
            isLifetime: rank === VipRank.STAR_7,
          },
          create: {
            userId,
            rank,
            assignedByAdmin: true,
            achievedAt: new Date(),
            salaryStartAt: new Date(),
            isLifetime: rank === VipRank.STAR_7,
          },
        }),

        prisma.rankHistory.create({
          data: {
            userId,
            rank,
            action: "ASSIGN",
            adminId,
          },
        }),
      ]);
    } else {
      // 🔴 UNASSIGN
      await prisma.$transaction([
        prisma.userRank.update({
          where: { userId },
          data: {
            rank: VipRank.NONE,
            assignedByAdmin: false,
            achievedAt: null,
            salaryStartAt: null,
            isLifetime: false,
          },
        }),

        prisma.rankHistory.create({
          data: {
            userId,
            rank: VipRank.NONE,
            action: "UNASSIGN",
            adminId,
          },
        }),
      ]);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("RANK TOGGLE ERROR:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
