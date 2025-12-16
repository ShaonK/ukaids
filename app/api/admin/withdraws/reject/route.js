import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const { id } = await req.json();

    await prisma.withdrawRequest.update({
      where: { id },
      data: {
        status: "rejected",
        rejectedAt: new Date(),
      },
    });

    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: "Reject failed" }, { status: 500 });
  }
}
