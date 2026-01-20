import prisma from "@/lib/prisma";
import { getAdmin } from "@/lib/getAdmin";

export async function GET(req) {
  const admin = await getAdmin();
  if (!admin) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";

  const users = await prisma.user.findMany({
    where: {
      OR: [
        { username: { contains: q, mode: "insensitive" } },
        { mobile: { contains: q } },
      ],
    },
    select: {
      id: true,
      username: true,
      mobile: true,
      isBlocked: true,
      createdAt: true,
    },
    orderBy: { id: "desc" },
  });

  return Response.json({ users });
}
