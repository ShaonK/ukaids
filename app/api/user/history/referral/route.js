import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";

export async function GET() {
  const user = await getUser();
  if (!user) return Response.json({ items: [] });

  const items = await prisma.referralCommissionHistory.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return Response.json({
    items: items.map((r) => ({
      type: `Referral L${r.level}`,
      amount: r.commission,
      date: r.createdAt,
      extra: `From User: ${r.fromUserId}`
    })),
  });
}
