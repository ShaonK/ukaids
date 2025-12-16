import prisma from "@/lib/prisma";

export async function POST(req) {
    try {
        const { id } = await req.json();
        if (!id) {
            return Response.json({ error: "Transfer ID required" }, { status: 400 });
        }

        const transfer = await prisma.balanceTransfer.findUnique({
            where: { id },
        });

        if (!transfer) {
            return Response.json({ error: "Transfer not found" }, { status: 404 });
        }

        if (transfer.status !== "PENDING") {
            return Response.json(
                { error: "Transfer already processed" },
                { status: 400 }
            );
        }

        await prisma.balanceTransfer.update({
            where: { id },
            data: { status: "REJECTED" },
        });

        return Response.json({
            success: true,
            message: "Transfer rejected successfully",
        });

    } catch (err) {
        console.error("TRANSFER REJECT ERROR:", err);
        return Response.json(
            { error: err.message || "Reject failed" },
            { status: 500 }
        );
    }
}
