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
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 10);
  const skip = (page - 1) * limit;

  const where = q
    ? {
        OR: [
          { username: { contains: q, mode: "insensitive" } },
          { mobile: { contains: q } },
          ...(Number(q) ? [{ id: Number(q) }] : []),
        ],
      }
    : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        username: true,
        mobile: true,
        isBlocked: true,
        createdAt: true,
      },
      orderBy: { id: "desc" },
      skip,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return Response.json({
    users,
    page,
    totalPages: Math.ceil(total / limit),
    total,
  });
}
