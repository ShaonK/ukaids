import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";

// DATE RANGE HELPER (UTC SAFE)
function getDateRange(fromStr, toStr) {
  if (!fromStr && !toStr) return null;

  const from = fromStr ? new Date(fromStr + "T00:00:00.000Z") : null;
  const to   = toStr   ? new Date(toStr   + "T23:59:59.999Z") : null;

  return { from, to };
}

export async function GET(req) {
  try {
    const user = await getUser();
    if (!user) {
      return Response.json({ history: [], totalPages: 1 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    const fromStr = searchParams.get("from");
    const toStr = searchParams.get("to");
    const range = getDateRange(fromStr, toStr);

    let where = { userId: user.id };
    if (range) {
      where.createdAt = {};
      if (range.from) where.createdAt.gte = range.from;
      if (range.to) where.createdAt.lte = range.to;
    }

    const [rows, total] = await Promise.all([
      prisma.roiHistory.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          earning: {
            select: {
              depositId: true
            }
          }
        }
      }),
      prisma.roiHistory.count({ where })
    ]);

    const formatted = rows.map(r => ({
      amount: Number(r.amount),
      type: "ROI Income",
      from: r.earning?.depositId
        ? `Deposit #${r.earning.depositId}`
        : "ROI Task Earning",
      createdAt: r.createdAt
    }));

    return Response.json({
      history: formatted,
      totalPages: Math.max(1, Math.ceil(total / limit))
    });

  } catch (err) {
    console.error("ROI HISTORY ERROR:", err);
    return Response.json({ history: [], totalPages: 1 });
  }
}
