import prisma from "@/lib/prisma";
import { getAdmin } from "@/lib/getAdmin";

export async function GET(req) {
    try {
        const admin = await getAdmin();
        if (!admin) {
            return Response.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(req.url);

        const userQuery = searchParams.get("user");
        const walletType = searchParams.get("wallet");
        const from = searchParams.get("from");
        const to = searchParams.get("to");

        const where = {
            source: "ADMIN_DEDUCT",
        };

        // 👤 USER FILTER
        if (userQuery) {
            where.user = {
                OR: [
                    {
                        username: {
                            contains: userQuery,
                            mode: "insensitive",
                        },
                    },
                    {
                        id: Number(userQuery) || -1,
                    },
                ],
            };
        }

        // 💼 WALLET FILTER
        if (walletType) {
            where.walletType = walletType;
        }

        // 📅 DATE FILTER
        if (from || to) {
            where.createdAt = {};
            if (from) where.createdAt.gte = new Date(from);
            if (to)
                where.createdAt.lte = new Date(
                    `${to}T23:59:59`
                );
        }

        const items = await prisma.walletTransaction.findMany({
            where,
            orderBy: { createdAt: "desc" },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        mobile: true,
                    },
                },
            },
        });

        // ✅ ALWAYS CONSISTENT RESPONSE
        return Response.json({
            items: Array.isArray(items) ? items : [],
        });
    } catch (err) {
        console.error("ADMIN WALLET DEDUCTION ERROR:", err);
        return Response.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}
