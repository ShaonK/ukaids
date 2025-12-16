// app/api/admin/withdraws/route.js
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const withdraws = await prisma.withdrawRequest.findMany({
      where: {
        status: "pending",
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            username: true,
            withdrawAddress: {
              select: {
                address: true,
                network: true,
              },
            },
          },
        },
      },
    });

    return Response.json({ withdraws });
  } catch (err) {
    console.error("ADMIN WITHDRAW LIST ERROR:", err);
    return Response.json(
      { error: "Failed to load withdraw requests" },
      { status: 500 }
    );
  }
}
