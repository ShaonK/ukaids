import prisma from "@/lib/prisma";

/* ======================
   UPDATE NOTICE
====================== */
export async function PATCH(req, context) {
  const params = await context.params;
  const id = Number(params.id);

  const { title, message, isActive } = await req.json();

  if (!id) {
    return Response.json({ error: "Invalid ID" }, { status: 400 });
  }

  // 🔒 যদি এটাকে active করা হয় → আগে সব inactive
  if (isActive === true) {
    await prisma.notice.updateMany({
      data: { isActive: false },
    });
  }

  const updated = await prisma.notice.update({
    where: { id },
    data: {
      title,
      message,
      isActive: Boolean(isActive),
    },
  });

  return Response.json(updated);
}

/* ======================
   DELETE NOTICE
====================== */
export async function DELETE(req, context) {
  const params = await context.params;
  const id = Number(params.id);

  if (!id) {
    return Response.json({ error: "Invalid ID" }, { status: 400 });
  }

  // 🔥 Active হলেও delete allow
  await prisma.notice.delete({
    where: { id },
  });

  return Response.json({ success: true });
}
