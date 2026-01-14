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
        userRank: {
          select: {
            rank: true,
          },
        },
      },
    });

    return Response.json({
      user: {
        id: data.id,
        username: data.username,
        rank: data.userRank?.rank || null,
      },
    });
  } catch (err) {
    console.error("USER ME ERROR:", err);
    return Response.json({ user: null }, { status: 500 });
  }
}
