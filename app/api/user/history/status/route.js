import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";

export async function GET(req) {
  try {
    const user = await getUser();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);

    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const skip = (page - 1) * limit;

    // DATE FILTER (optional)
    let dateFilter = {};
    if (from && to) {
      dateFilter = {
        startDate: {
          gte: new Date(from),
        },
        OR: [
          { createdAt: { gte: new Date(from) } },
          { startDate: { gte: new Date(from) } },
        ],
      };
    }

    // TOTAL COUNT
    const total = await prisma.userStatusHistory.count({
      where: {
        userId: user.id,
        ...dateFilter,
      }
    });

    const totalPages = Math.ceil(total / limit);

    // MAIN QUERY
    const history = await prisma.userStatusHistory.findMany({
      where: {
        userId: user.id,
        ...dateFilter,
      },
      orderBy: { id: "desc" },
      skip,
      take: limit,
      select: {
        id: true,
        status: true,
        reason: true,
        startDate: true,
        endDate: true,
        closedAt: true,
        createdAt: true,   // FIXED ✔
      },
    });

    return Response.json({
      history,
      totalPages,
    });

  } catch (err) {
    console.error("STATUS HISTORY API ERROR:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
