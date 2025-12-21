import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const packages = await prisma.package.findMany({
      where: { isActive: true },
      orderBy: { amount: "asc" },
    });

    // 🔥 BUSINESS RULE HERE
    const mapped = packages.map((pkg) => {
      if (Number(pkg.amount) > 500) {
        return {
          ...pkg,
          status: "UPCOMING",
          isPurchasable: false,
        };
      }

      return {
        ...pkg,
        status: "ACTIVE",
        isPurchasable: true,
      };
    });

    return Response.json(mapped);
  } catch (err) {
    console.error("PACKAGES API ERROR:", err);
    return Response.json([], { status: 500 });
  }
}
