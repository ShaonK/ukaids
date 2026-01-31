import prisma from "@/lib/prisma";

export async function GET() {
  const notice = await prisma.notice.findFirst({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(notice ?? null);
}
