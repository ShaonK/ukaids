import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const list = await prisma.withdraw.findMany({
      where: {
        status: "approved",
      },
      orderBy: {
        approvedAt: "desc",
      },
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
  } catch (err) {
    console.error("Approved withdraw fetch error:", err);
    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
