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

async function buildTree(userId, generation = 1) {
  const children = await prisma.user.findMany({
    where: { referredBy: userId },
    select: {
      id: true,
      fullname: true,
      username: true,
      referredBy: true,
    }
  });

  const tree = [];
  for (const child of children) {
    const subtree = await buildTree(child.id, generation + 1);

    tree.push({
      id: child.id,
      fullname: child.fullname,
      username: child.username,
      generation, // MLM depth
      rate: LEVEL_RATES[generation] ?? 0,
      children: subtree,
    });
  }

  return tree;
}

async function getIncomeSummary(userId) {
  const rows = await prisma.roiLevelIncome.findMany({
    where: { userId },
    select: {
      fromUserId: true,
      level: true,
      amount: true,
    }
  });

  const summary = {
    total: 0,
    levels: {},
    fromUsers: {},
  };

  for (const row of rows) {
    summary.total += row.amount;

    if (!summary.levels[row.level]) summary.levels[row.level] = 0;
    summary.levels[row.level] += row.amount;

    if (!summary.fromUsers[row.fromUserId]) summary.fromUsers[row.fromUserId] = 0;
    summary.fromUsers[row.fromUserId] += row.amount;
  }

  summary.total = Number(summary.total.toFixed(2));
  Object.keys(summary.levels).forEach(lvl => {
    summary.levels[lvl] = Number(summary.levels[lvl].toFixed(2));
  });
  Object.keys(summary.fromUsers).forEach(uid => {
    summary.fromUsers[uid] = Number(summary.fromUsers[uid].toFixed(2));
  });

  return summary;
}

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
