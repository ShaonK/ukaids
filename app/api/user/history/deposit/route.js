import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";

export async function GET(req) {
  try {
    const user = await getUser();
    if (!user)
      return Response.json({ history: [], totalPages: 1 });

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    const [rows, total] = await Promise.all([
      prisma.userPackage.findMany({
        where: { userId: user.id },
        include: { package: true },
        orderBy: { startedAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.userPackage.count({
        where: { userId: user.id },
      }),
    ]);

    const formatted = rows.map(p => ({
      amount: p.amount,
      type: p.isActive ? "Package Active" : "Package Closed",
      from: p.package.name,
      createdAt: p.startedAt,
    }));

    return Response.json({
      history: formatted,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    });
  } catch (err) {
    console.error("DEPOSIT HISTORY ERROR:", err);
    return Response.json({ history: [], totalPages: 1 });
  }
}
