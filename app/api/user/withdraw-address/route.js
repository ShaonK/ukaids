import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";

/**
 * GET → check if withdraw address exists
 */
export async function GET() {
  try {
    const user = await getUser();
    if (!user) {
      return Response.json({ address: null });
    }

    const address = await prisma.withdrawAddress.findUnique({
      where: { userId: user.id },
    });

    if (!address) {
      return Response.json({ address: null });
    }

    return Response.json({
      address: address.address,
      network: address.network,
    });
  } catch (err) {
    console.error("GET WITHDRAW ADDRESS ERROR:", err);
    return Response.json({ address: null });
  }
}

/**
 * POST → save / update withdraw address
 */
export async function POST(req) {
  try {
    const user = await getUser();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { address, network } = await req.json();

    if (!address || !network) {
      return Response.json(
        { error: "Address and network required" },
        { status: 400 }
      );
    }

    await prisma.withdrawAddress.upsert({
      where: { userId: user.id },
      update: { address, network },
      create: {
        userId: user.id,
        address,
        network,
      },
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error("POST WITHDRAW ADDRESS ERROR:", err);
    return Response.json(
      { error: "Failed to save withdraw address" },
      { status: 500 }
    );
  }
}
