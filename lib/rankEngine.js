// lib/rankEngine.js
import prisma from "@/lib/prisma";
import { VIP_RANKS } from "@/lib/vipConfig";

/* =========================
   HELPERS
========================= */
function getRankIndex(rank) {
  return VIP_RANKS.findIndex((r) => r.rank === rank);
}

function calculateRank(directCount, teamCount) {
  let achieved = null;
  for (const rule of VIP_RANKS) {
    if (directCount >= rule.direct && teamCount >= rule.team) {
      achieved = rule;
    }
  }
  return achieved;
}

/* =========================
   TEAM COUNT (RECURSIVE)
========================= */
async function countTeam(userId) {
  const children = await prisma.user.findMany({
    where: { referredBy: userId },
    select: { id: true },
  });

  let total = children.length;
  for (const child of children) {
    total += await countTeam(child.id);
  }
  return total;
}

/* =========================
   AUTO RANK ENGINE
   ❌ NEVER OVERRIDE ADMIN
========================= */
export async function recalcUserRank(userId) {
  const existing = await prisma.userRank.findUnique({
    where: { userId },
  });

  // ❌ Admin assigned rank is locked
  if (existing?.assignedByAdmin) {
    return existing;
  }

  const directCount = await prisma.user.count({
    where: { referredBy: userId },
  });

  const teamCount = await countTeam(userId);
  const rule = calculateRank(directCount, teamCount);
  if (!rule) return existing;

  if (existing) {
    const currentIndex = getRankIndex(existing.rank);
    const newIndex = getRankIndex(rule.rank);
    if (currentIndex >= newIndex) {
      return existing; // ❌ no downgrade
    }
  }

  const salaryStartAt = new Date(
    Date.now() + 30 * 24 * 60 * 60 * 1000
  );

  return prisma.userRank.upsert({
    where: { userId },
    update: {
      rank: rule.rank,
      directCount,
      teamCount,
      isLifetime: rule.lifetime,
      achievedAt: new Date(),
      salaryStartAt,
      assignedByAdmin: false,
    },
    create: {
      userId,
      rank: rule.rank,
      directCount,
      teamCount,
      achievedAt: new Date(),
      salaryStartAt,
      isLifetime: rule.lifetime,
      assignedByAdmin: false,
    },
  });
}
