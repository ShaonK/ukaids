import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";

export async function GET(req) {
  const user = await getUser();
  if (!user)
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 10);
  const skip = (page - 1) * limit;

  const where = {
    userId: user.id,
    walletType: "ACCOUNT",
  };

  const history = await prisma.walletTransaction.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip,
    take: limit,
  });

  const total = await prisma.walletTransaction.count({ where });

  return Response.json({
    history: history.map(h => ({
      amount: h.direction === "DEBIT" ? -h.amount : h.amount,
      type: h.source.replaceAll("_", " "),
      from: h.note || null,
      createdAt: h.createdAt,
    })),
    totalPages: Math.ceil(total / limit),
  });
}
