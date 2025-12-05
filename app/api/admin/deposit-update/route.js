import prisma from "@/lib/prisma";

export async function POST(req) {
    const { id, status } = await req.json();

    const deposit = await prisma.deposit.findUnique({
        where: { id },
    });

    if (!deposit) {
        return Response.json({ error: "Deposit not found" }, { status: 404 });
    }

    // 🚀 APPROVE হলে Wallet Update হবে
    if (status === "approved") {
        await prisma.wallet.update({
            where: { userId: deposit.userId },
            data: {
                mainWallet: {
                    increment: deposit.amount
                }
            }
        });
    }

    // Update status
    await prisma.deposit.update({
        where: { id },
        data: { status },
    });

    return Response.json({ success: true });
}
