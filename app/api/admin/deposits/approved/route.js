import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const list = await prisma.approvedDeposit.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullname: true,
          },
        },
      },
    });

    return Response.json(list);
  } catch (error) {
    console.error("Approved deposit fetch error:", error);
    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
