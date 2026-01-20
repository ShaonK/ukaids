import prisma from "@/lib/prisma";
import { getAdmin } from "@/lib/getAdmin";

export async function GET(req, context) {
  try {
    const admin = await getAdmin();
    if (!admin) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // ✅ Next.js 16: params is Promise
    const params = await context.params;
    const id = Number(params?.id);

    if (!id || isNaN(id)) {
      return Response.json(
        { error: "Invalid user id" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        mobile: true,
        email: true,
        isActive: true,
        isBlocked: true,
        createdAt: true,
        wallet: {
          select: {
            mainWallet: true,
            roiWallet: true,
            referralWallet: true,
            levelWallet: true,
            salaryWallet: true,
            donationWallet: true,
            returnWallet: true,
          },
        },
      },
    });

    if (!user) {
      return Response.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return Response.json({ user });
  } catch (err) {
    console.error("GET ADMIN USER ERROR:", err);
    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
