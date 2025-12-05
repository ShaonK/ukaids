import prisma from "@/lib/prisma";

export async function POST(req) {
    const { id, status } = await req.json();

    const withdraw = await prisma.withdraw.findUnique({
        where: { id },
    });

    if (!withdraw) {
        return Response.json({ error: "Withdraw not found" }, { status: 404 });
    }

    // APPROVE হলে Wallet থেকে কমানো হবে
    if (status === "approved") {
        await prisma.wallet.update({
            where: { userId: withdraw.userId },
            data: {
                mainWallet: {
                    decrement: withdraw.amount
                }
            }
        });
    }

    // Update status
    await prisma.withdraw.update({
        where: { id },
        data: { status },
    });

    return Response.json({ success: true });
}
