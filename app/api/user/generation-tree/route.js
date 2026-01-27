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
 * Also returns package totals per generation
 */
async function buildTree(
  parentUserId,
  generation = 1,
  generationPackages = {}
) {
  const children = await prisma.user.findMany({
    where: { referredBy: parentUserId },
    select: {
      id: true,
      fullname: true,
      username: true,
    },
  });

  const parentDirectCount = await prisma.user.count({
    where: { referredBy: parentUserId },
  });

  const tree = [];

  for (const child of children) {
    /* 🔥 PACKAGE TOTAL FOR THIS USER */
    const pkgAgg = await prisma.userPackage.aggregate({
      where: { userId: child.id },
      _sum: { amount: true },
    });

    const userPackageTotal = Number(pkgAgg._sum.amount || 0);

    /* 🔥 ADD TO GENERATION TOTAL */
    if (!generationPackages[generation]) {
      generationPackages[generation] = 0;
    }
    generationPackages[generation] += userPackageTotal;

    const subtree = await buildTree(
      child.id,
      generation + 1,
      generationPackages
    );

    tree.push({
      id: child.id,
      fullname: child.fullname,
      username: child.username,

      generation,
      rate: LEVEL_RATES[generation] ?? 0,

      unlockRequired: generation,
      unlockDirects: parentDirectCount,
      isUnlocked: parentDirectCount >= generation,

      packageTotal: userPackageTotal,
      children: subtree,
    });
  }

  return tree;
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

    const generationPackages = {};

    const tree = await buildTree(
      user.id,
      1,
      generationPackages
    );

    const generationCounts = countGenerations(tree);

    const directReferrals = await prisma.user.count({
      where: { referredBy: user.id },
    });

    return Response.json({
      tree,
      generationCounts,
      generationPackageTotals: generationPackages,
      directReferrals,
    });
  } catch (err) {
    console.error("GENERATION API ERROR:", err);
    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
