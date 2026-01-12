import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";

export async function GET() {
    try {
        const user = await getUser();
        if (!user) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const roiAgg = await prisma.roiHistory.aggregate({
            where: { userId: user.id },
            _sum: { amount: true },
        });

        const levelAgg = await prisma.roiLevelIncome.aggregate({
            where: { userId: user.id },
            _sum: { amount: true },
        });

        const referralAgg = await prisma.referralCommissionHistory.aggregate({
            where: { userId: user.id },
            _sum: { commission: true },
        });

        return Response.json({
            roi: Number(roiAgg._sum.amount || 0),
            level: Number(levelAgg._sum.amount || 0),
            referral: Number(referralAgg._sum.commission || 0),
        });
    } catch (err) {
        console.error("INCOME SUMMARY API ERROR:", err);
        return Response.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}
