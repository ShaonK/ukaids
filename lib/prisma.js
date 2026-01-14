// lib/prisma.js
import { PrismaClient } from "@prisma/client";

/**
 * ✅ Global Prisma Client
 * - Prevents multiple connections in dev
 * - Works with Next.js App Router
 * - Works with standalone Node scripts
 * - Safe for Vercel
 */

const globalForPrisma = globalThis;

/** @type {PrismaClient} */
const prisma =
  globalForPrisma.__prisma__ ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.__prisma__ = prisma;
}

export default prisma;
