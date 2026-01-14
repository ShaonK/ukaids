import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";

export async function GET() {
  try {
    const user = await getUser();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const wallet = await prisma.wallet.upsert({
      where: { userId: user.id },
      update: {},
      create: { userId: user.id },
    });

    return Response.json({ success: true, wallet });

  } catch (err) {
    console.error("WALLET API ERROR:", err);
    return Response.json({ error: "Server Error" }, { status: 500 });
  }
}
