import prisma from "@/lib/prisma";

const UPGRADE_LIMIT = 500;

export async function GET() {
  try {
    const packages = await prisma.package.findMany({
      orderBy: { position: "asc" },
    });

    const mapped = packages.map((pkg) => {
      const isBelowOrEqualLimit = pkg.amount <= UPGRADE_LIMIT;

      return {
        ...pkg,

        // 🔥 USER LOGIC
        canBuy: isBelowOrEqualLimit && pkg.isActive,
        canUpgrade: pkg.amount > UPGRADE_LIMIT && pkg.isActive,
        isUpcoming: pkg.amount > UPGRADE_LIMIT && !pkg.isActive,
      };
    });

    return Response.json(mapped);
  } catch (err) {
    console.error("PACKAGES API ERROR:", err);
    return Response.json([], { status: 500 });
  }
}
