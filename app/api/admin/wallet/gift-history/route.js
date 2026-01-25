import prisma from "@/lib/prisma";
import { getAdmin } from "@/lib/getAdmin";

export async function GET() {
  const admin = await getAdmin();
  if (!admin) {
    return Response.json([], { status: 401 });
  }

  const rows = await prisma.walletTransaction.findMany({
    where: {
      source: "ADMIN_GIFT",
      reversed: false, // 🔥 ONLY ACTIVE GIFTS
    },
    orderBy: {
      id: "desc",
    },
    select: {
      id: true,
      userId: true,
      amount: true,
      createdAt: true,
      reversed: true,
      user: {
        select: {
          username: true,
          mobile: true,
        },
      },
    },
  });

  return Response.json(rows);
}
