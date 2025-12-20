// app/api/user/generation-tree/route.js
import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";

const LEVEL_RATES = {
  1: 0.05,
  2: 0.04,
  3: 0.03,
  4: 0.02,
  5: 0.01,
};

/**
 * Build MLM tree
 * - current user = parent
 * - direct referral = generation 1
 * - unlock depends on PARENT's direct referrals
 */
async function buildTree(parentUserId, generation = 1) {
  // children of this parent
  const children = await prisma.user.findMany({
    where: { referredBy: parentUserId },
    select: {
      id: true,
      fullname: true,
      username: true,
    },
  });

  // 🔑 direct referrals of THIS parent (unlock condition)
  const parentDirectCount = await prisma.user.count({
    where: { referredBy: parentUserId },
  });

  const tree = [];

  for (const child of children) {
    const subtree = await buildTree(child.id, generation + 1);

    tree.push({
      id: child.id,
      fullname: child.fullname,
      username: child.username,

      // MLM info
      generation,
      rate: LEVEL_RATES[generation] ?? 0,

      // 🔐 level unlock info (IMPORTANT)
      unlockRequired: generation,
      unlockDirects: parentDirectCount,
      isUnlocked: parentDirectCount >= generation,

      children: subtree,
    });
  }

  return tree;
}

/**
 * Income summary from roiLevelIncome
 */
async function getIncomeSummary(userId) {
  const rows = await prisma.roiLevelIncome.findMany({
    where: { userId },
    select: {
      level: true,
      amount: true,
    },
  });

  const summary = {
    total: 0,
    levels: {},
  };

  for (const row of rows) {
    summary.total += Number(row.amount);

    if (!summary.levels[row.level]) summary.levels[row.level] = 0;
    summary.levels[row.level] += Number(row.amount);
  }

  summary.total = Number(summary.total.toFixed(2));
  Object.keys(summary.levels).forEach((lvl) => {
    summary.levels[lvl] = Number(summary.levels[lvl].toFixed(2));
  });

  return summary;
}

/**
 * Count users per generation
 */
function countGenerations(tree, gen = 1, stats = {}) {
  if (!stats[gen]) stats[gen] = 0;

  for (const node of tree) {
    stats[gen] += 1;
    if (node.children?.length > 0) {
      countGenerations(node.children, gen + 1, stats);
    }
  }

  return stats;
}

export async function GET() {
  try {
    const user = await getUser();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tree = await buildTree(user.id);
    const generationCounts = countGenerations(tree);

    const directReferrals = await prisma.user.count({
      where: { referredBy: user.id },
    });

    const income = await getIncomeSummary(user.id);

    return Response.json({
      tree,
      generationCounts,
      directReferrals,
      income,
    });
  } catch (err) {
    console.error("GENERATION API ERROR:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
