import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const list = await prisma.deposit.findMany({
      where: { status: "pending" },
      orderBy: { createdAt: "desc" },
    });

    return Response.json(list);
  } catch (err) {
    console.error(err);
    return Response.json([], { status: 500 });
  }
}
