import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";

export async function GET() {
  try {
    const user = await getUser();
    if (!user)
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    const wallet = await prisma.wallet.findUnique({
      where: { userId: user.id }
    });

    const roi = await prisma.roiHistory.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" }
    });

    const level = await prisma.roiLevelIncome.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" }
    });

    const referral = await prisma.referralCommissionHistory.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" }
    });

    const deposit = await prisma.approvedDeposit.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" }
    });

    return Response.json({
      wallet,
      roi,
      level,
      referral,
      deposit
    });

  } catch (err) {
    console.error("WALLET HISTORY ERROR:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
