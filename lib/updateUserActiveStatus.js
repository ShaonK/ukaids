// lib/updateUserActiveStatus.js
import prisma from "@/lib/prisma";

/**
 * Ensure user is active.
 * If already active → do nothing
 * If inactive → activate
 * Must be called inside a transaction
 */
export async function ensureUserActive(tx, userId) {
  const user = await tx.user.findUnique({
    where: { id: userId },
    select: { isActive: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.isActive) {
    await tx.user.update({
      where: { id: userId },
      data: { isActive: true },
    });
  }
}
