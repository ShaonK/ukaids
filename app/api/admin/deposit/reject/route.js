import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const body = await req.json();
    const id = Number(body?.id);

    if (!id) return Response.json({ error: "ID missing" }, { status: 400 });

    const dep = await prisma.deposit.findUnique({ where: { id } });
    if (!dep) return Response.json({ error: "Not found" }, { status: 400 });

    if (dep.status !== "pending")
      return Response.json({ error: "Already processed" }, { status: 400 });

    await prisma.deposit.update({
      where: { id },
      data: { status: "rejected" },
    });

    await prisma.rejectedDeposit.create({
      data: {
        userId: dep.userId,
        amount: dep.amount,
        trxId: dep.trxId,
      },
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
