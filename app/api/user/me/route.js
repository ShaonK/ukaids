import { getUser } from "@/lib/getUser";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getUser();

    if (!user) {
      return Response.json({ user: null }, { status: 401 });
    }

    const data = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        username: true,
        referralCode: true, // ✅ ADD
        isActive: true,
        isBlocked: true,
        isSuspended: true,
        userRank: {
          select: {
            rank: true,
          },
        },
      },
    });

    if (!data) {
      return Response.json({ user: null }, { status: 404 });
    }

    return Response.json({
      user: {
        id: data.id,
        username: data.username,
        referralCode: data.referralCode, // ✅ SEND TO FRONTEND
        isActive: data.isActive,
        isBlocked: data.isBlocked,
        isSuspended: data.isSuspended,
        rank: data.userRank?.rank || null,
      },
    });
  } catch (err) {
    console.error("USER ME ERROR:", err);
    return Response.json({ user: null }, { status: 500 });
  }
}
