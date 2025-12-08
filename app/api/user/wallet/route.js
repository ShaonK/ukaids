import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";

export async function GET() {
    try {
        const user = await getUser();
        if (!user) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const wallet = await prisma.wallet.findUnique({
            where: { userId: user.id },
        });

        if (!wallet) {
            return Response.json({ error: "Wallet not found" }, { status: 404 });
        }

        return Response.json({ success: true, wallet });
    }
    catch (err) {
        console.log("WALLET API ERROR:", err);
        return Response.json({ error: "Server Error" }, { status: 500 });
    }
}
