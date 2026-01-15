import prisma from "@/lib/prisma";

/**
 * STRICT MLM TEAM SERVICE
 * - Tree based on referredBy
 * - Active Deposit = UserPackage.isActive = true
 * - Max generation: dynamic (UI can decide)
 */
export async function getTeamData(rootUserId) {
  /* -----------------------------
     1️⃣ BUILD GENERATION TREE
  ------------------------------*/
  const generations = {};
  let currentIds = [rootUserId];
  let generation = 1;

  while (currentIds.length > 0) {
    const users = await prisma.user.findMany({
      where: {
        referredBy: { in: currentIds },
      },
      select: {
        id: true,
        username: true,
        isActive: true,
      },
    });

    if (!users.length) break;

    generations[generation] = users;
    currentIds = users.map((u) => u.id);
    generation++;
  }

  /* -----------------------------
     2️⃣ FLATTEN TEAM
  ------------------------------*/
  const allTeamUsers = Object.values(generations).flat();
  const userIds = allTeamUsers.map((u) => u.id);

  /* -----------------------------
     3️⃣ ACTIVE DEPOSIT (SOURCE OF TRUTH)
     UserPackage.isActive = true
  ------------------------------*/
  const activePackages = await prisma.userPackage.findMany({
    where: {
      userId: { in: userIds },
      isActive: true,
    },
    select: {
      userId: true,
      amount: true,
    },
  });

  // userId -> deposit amount
  const depositMap = {};
  for (const pkg of activePackages) {
    depositMap[pkg.userId] = Number(pkg.amount);
  }

  /* -----------------------------
     4️⃣ FINAL TEAM FORMAT
  ------------------------------*/
  const team = [];

  Object.entries(generations).forEach(
    ([gen, users]) => {
      users.forEach((u) => {
        team.push({
          id: u.id,
          username: u.username,
          isActive: u.isActive,
          generation: Number(gen),
          totalDeposit: depositMap[u.id] || 0, // ✅ KEY FIELD
        });
      });
    }
  );

  return {
    generations,
    team,
    totalTeamCount: team.length,
  };
}
