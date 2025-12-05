import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

async function getAdminId() {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;

    if (!token) return null;

    try {
        const { payload } = await jwtVerify(token, SECRET);
        return payload.id; // admin id
    } catch (err) {
        return null;
    }
}

export async function POST(req) {
    try {
        const { id } = await req.json();
        const adminId = await getAdminId();   // 🔥 ADMIN ID FOUND

        if (!adminId) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const deposit = await prisma.deposit.findUnique({ where: { id } });

        if (!deposit) {
            return Response.json({ error: "Deposit not found" }, { status: 400 });
        }

        if (deposit.status !== "pending") {
            return Response.json({
                error: "This request is already processed"
            }, { status: 400 });
        }

        // Update status
        await prisma.deposit.update({
            where: { id },
            data: { status: "approved" },
        });

        // Update Wallet
        await prisma.wallet.update({
            where: { userId: deposit.userId },
            data: { mainWallet: { increment: deposit.amount } },
        });

        // Save History
        await prisma.depositHistory.create({
            data: {
                userId: deposit.userId,
                depositId: deposit.id,
                amount: deposit.amount,
                trxId: deposit.trxId,
                status: "approved",
                processedBy: adminId,   // 🔥 REQUIRED FIELD FIXED
            },
        });

        return Response.json({ success: true });
    } catch (err) {
        console.error(err);
        return Response.json({ error: "Server error" }, { status: 500 });
    }
}
