import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";

export async function GET() {
  try {
    const user = await getUser();
    if (!user) {
      return Response.json(null);
    }

    const activePackage = await prisma.userPackage.findFirst({
      where: {
        userId: user.id,
        isActive: true,
      },
      orderBy: {
        startedAt: "desc", // ⭐ MOST IMPORTANT FIX
      },
    });

    return Response.json(activePackage);
  } catch (err) {
    console.error("ACTIVE PACKAGE ERROR:", err);
    return Response.json(null, { status: 500 });
  }
}
