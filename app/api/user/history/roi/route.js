import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";

export async function GET() {
  try {
    const user = await getUser();
    if (!user) return Response.json({ history: [] });

    const rows = await prisma.roiHistory.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: { earning: true }
    });

    const formatted = rows.map(r => ({
      amount: Number(r.amount),
      type: "ROI",
      from: `Deposit #${r.earning.depositId}`,
      createdAt: r.createdAt
    }));

    return Response.json({ history: formatted });
  } catch (err) {
    console.error("ROI HISTORY ERROR:", err);
    return Response.json({ history: [] });
  }
}
