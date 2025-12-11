import prisma from "@/lib/prisma";

export async function GET() {
  const models = Object.keys(prisma);
  console.log("🔥 LOADED PRISMA MODELS →", models);
  return Response.json({ models });
}
