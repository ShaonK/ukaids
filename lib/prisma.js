// lib/prisma.js
import { PrismaClient } from "@prisma/client";

/**
 * Global prisma instance for Next.js
 * Prevents exhausting database connections in development
 */

const globalForPrisma = globalThis;

/** @type {PrismaClient} */
const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
