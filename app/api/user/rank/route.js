import { getUser } from "@/lib/getUser";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getUser();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rank = await prisma.userRank.findUnique({
      where: { userId: user.id },
    });

    return Response.json({ success: true, rank });
  } catch (error) {
    console.error("Rank API error:", error);
    return Response.json(
      { error: "Failed to fetch rank" },
      { status: 500 }
    );
  }
}
