import prisma from "@/lib/prisma";

export async function GET() {
    const packages = await prisma.package.findMany({
        where: { isActive: true },
        orderBy: { position: "asc" },
    });

    return Response.json(packages);
}
