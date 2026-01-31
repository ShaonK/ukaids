import prisma from "@/lib/prisma";

export async function PATCH(req, context) {
  const params = await context.params;
  const id = Number(params.id);

  if (!id) {
    return Response.json({ error: "Invalid ID" }, { status: 400 });
  }

  // 🔥 force reset
  await prisma.notice.updateMany({
    data: { isActive: false },
  });

  // 🔥 activate only this one
  await prisma.notice.update({
    where: { id },
    data: { isActive: true },
  });

  return Response.json({ success: true });
}
