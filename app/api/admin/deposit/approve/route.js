import prisma from "@/lib/prisma";

export async function POST(req) {
    try {
        const { id } = await req.json();

        const deposit = await prisma.deposit.findUnique({ where: { id } });

        if (!deposit) {
            return Response.json({ error: "Deposit not found" }, { status: 400 });
        }

        if (deposit.status !== "pending") {
            return Response.json(
                { error: "This request is already processed" },
                { status: 400 }
            );
        }

        // 1️⃣ Update Deposit status
        await prisma.deposit.update({
            where: { id },
            data: { status: "approved" },
        });

        // 2️⃣ Update user main wallet
        await prisma.wallet.update({
            where: { userId: deposit.userId },
            data: {
                mainWallet: { increment: deposit.amount },
            },
        });

        // 3️⃣ Insert into DepositHistory
        await prisma.depositHistory.create({
            data: {
                userId: deposit.userId,
                depositId: id,
                amount: deposit.amount,
                trxId: deposit.trxId,
                status: "approved",
                processedBy: 1, // TODO: real admin ID
            },
        });

        // 4️⃣ Insert into ApprovedDeposit table (FIX)
        await prisma.approvedDeposit.create({
            data: {
                userId: deposit.userId,
                amount: deposit.amount,
                trxId: deposit.trxId,
            },
        });

        return Response.json({ success: true });
    } catch (err) {
        console.log(err);
        return Response.json({ error: "Server error" }, { status: 500 });
    }
}
