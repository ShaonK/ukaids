import prisma from "@/lib/prisma";

export async function GET() {
  const notices = await prisma.notice.findMany({
    orderBy: { createdAt: "desc" },
  });
  return Response.json(notices);
}

export async function POST(req) {
  const { title, message, isActive } = await req.json();

  // 🔒 HARD RULE: only one active
  if (isActive) {
    await prisma.notice.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });
  }

  const notice = await prisma.notice.create({
    data: {
      title,
      message,
      isActive: Boolean(isActive),
    },
  });

  return Response.json(notice);
}
