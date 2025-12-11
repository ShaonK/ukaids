import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";

export async function GET() {
  try {
    const user = await getUser();
    if (!user) return Response.json({ history: [] });

    const rows = await prisma.referralCommissionHistory.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        fromUser: true
      }
    });

    const formatted = rows.map(r => ({
      amount: Number(r.commission),
      type: `Referral L${r.level}`,
      from: r.fromUser?.username ?? "Unknown",
      createdAt: r.createdAt
    }));

    return Response.json({ history: formatted });
  } catch (err) {
    console.error("REFERRAL HISTORY ERROR:", err);
    return Response.json({ history: [] });
  }
}
