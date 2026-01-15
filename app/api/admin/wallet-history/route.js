import prisma from "@/lib/prisma";

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page") || 1);
  const limit = 20;
  const skip = (page - 1) * limit;

  const where = {
    source: "ADMIN_CREDIT",
  };

  const [items, total] = await Promise.all([
    prisma.walletTransaction.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullname: true,
          },
        },
      },
    }),
    prisma.walletTransaction.count({ where }),
  ]);

  return Response.json({
    items: items.map(t => ({
      id: t.id,
      user: t.user.username,
      walletType: t.walletType,
      amount: t.amount,
      note: t.note,
      createdAt: t.createdAt,
    })),
    totalPages: Math.ceil(total / limit),
  });
}
