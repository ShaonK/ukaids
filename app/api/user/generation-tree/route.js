// app/api/user/generation-tree/route.js
import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";

// FINAL LEVEL INCOME RULE
const COMMISSION_RATES = {
  1: 0.05,
  2: 0.04,
  3: 0.03,
  4: 0.02,
  5: 0.01,
  default: 0
};

// Direct referral requirements
const UNLOCK_RULE = {
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5
};

// ------------------------------------
// Build recursive tree
// ------------------------------------
async function buildTree(userId, generation = 1) {
  const children = await prisma.user.findMany({
    where: { referredBy: userId },
    select: {
      id: true,
      fullname: true,
      username: true,
      referredBy: true
    }
  });

  let tree = [];

  for (const child of children) {
    const subtree = await buildTree(child.id, generation + 1);

    tree.push({
      id: child.id,
      fullname: child.fullname,
      username: child.username,
      generation,
      rate: COMMISSION_RATES[generation] ?? COMMISSION_RATES.default,
      unlockRequired: UNLOCK_RULE[generation] ?? null,
      children: subtree
    });
  }

  return tree;
}

// ------------------------------------
// Income Summary
// ------------------------------------
async function getIncomeSummary(rootId) {
  const incomes = await prisma.roiLevelIncome.findMany({
    where: { userId: rootId },
    select: {
      fromUserId: true,
      level: true,
      amount: true
    }
  });

  let summary = { total: 0, levels: {}, fromUsers: {} };

  for (const inc of incomes) {
    summary.total += inc.amount;

    if (!summary.levels[inc.level]) summary.levels[inc.level] = 0;
    summary.levels[inc.level] += inc.amount;

    if (!summary.fromUsers[inc.fromUserId]) summary.fromUsers[inc.fromUserId] = 0;
    summary.fromUsers[inc.fromUserId] += inc.amount;
  }

  summary.total = Number(summary.total.toFixed(2));

  Object.keys(summary.levels).forEach((lvl) => {
    summary.levels[lvl] = Number(summary.levels[lvl].toFixed(2));
  });

  Object.keys(summary.fromUsers).forEach((uid) => {
    summary.fromUsers[uid] = Number(summary.fromUsers[uid].toFixed(2));
  });

  return summary;
}

// ------------------------------------
// Count generations & total users
// ------------------------------------
function countGenerations(tree, gen = 1, stats = {}) {
  if (!stats[gen]) stats[gen] = 0;

  for (const node of tree) {
    stats[gen] += 1;

    if (node.children.length > 0) {
      countGenerations(node.children, gen + 1, stats);
    }
  }

  return stats;
}

export async function GET() {
  try {
    const user = await getUser();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const tree = await buildTree(user.id);
    const generationCounts = countGenerations(tree);
    const income = await getIncomeSummary(user.id);

    // Direct referrals count
    const directReferrals = await prisma.user.count({
      where: { referredBy: user.id }
    });

    return Response.json({
      tree,
      generationCounts,
      income,
      directReferrals
    });

  } catch (err) {
    console.error("GENERATION TREE API ERROR:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
