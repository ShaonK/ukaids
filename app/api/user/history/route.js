import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";

export async function GET() {
  const user = await getUser();
  if (!user) return Response.json({ items: [] });

  const items = await prisma.roiHistory.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return Response.json({
    items: items.map((r) => ({
      type: "ROI",
      amount: r.amount,
      date: r.createdAt,
      extra: `Earning ID: ${r.earningId}`
    })),
  });
}
