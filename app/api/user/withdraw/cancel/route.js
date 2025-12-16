// app/api/user/withdraw/cancel/route.js
import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";

export async function POST(req) {
    try {
        const user = await getUser();
        if (!user) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await req.json();

        if (!id) {
            return Response.json(
                { error: "Withdraw ID required" },
                { status: 400 }
            );
        }

        const withdraw = await prisma.withdrawRequest.findUnique({
            where: { id },
        });

        if (!withdraw) {
            return Response.json(
                { error: "Withdraw not found" },
                { status: 404 }
            );
        }

        // 🔐 Ownership check
        if (withdraw.userId !== user.id) {
            return Response.json(
                { error: "Forbidden" },
                { status: 403 }
            );
        }

        // ❌ Only pending allowed
        if (withdraw.status !== "pending") {
            return Response.json(
                { error: "Cannot cancel processed withdraw" },
                { status: 400 }
            );
        }

        await prisma.withdrawRequest.update({
            where: { id },
            data: {
                status: "cancelled",
                cancelledAt: new Date(),
            },
        });

        return Response.json({ success: true });

    } catch (err) {
        console.error("WITHDRAW CANCEL ERROR:", err);
        return Response.json(
            { error: "Cancel failed" },
            { status: 500 }
        );
    }
}
