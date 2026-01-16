import prisma from "@/lib/prisma";

/**
 * STRICT MLM TEAM SERVICE
 * - Tree based on referredBy
 * - Active Deposit = UserPackage.isActive = true
 * - Task Completed Today = userPackage.lastRoiAt >= today midnight
 * - User.isActive used ONLY for UI color
 */

function getTodayMidnight() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function getTeamData(rootUserId) {
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
        isActive: true, // 🔴 UI indicator
        userPackages: {
          where: { isActive: true },
          select: {
            amount: true,
            lastRoiAt: true,
          },
        },
      },
    });

    if (!users.length) break;

    const todayMidnight = getTodayMidnight();

    generations[generation] = users.map((u) => {
      const pkg = u.userPackages[0] || null;

      const taskCompletedToday =
        pkg?.lastRoiAt &&
        new Date(pkg.lastRoiAt) >= todayMidnight;

      return {
        id: u.id,
        username: u.username,
        generation,
        isActive: u.isActive, // 🔴 USER TABLE
        totalDeposit: Number(pkg?.amount || 0),
        taskCompletedToday: !!taskCompletedToday, // ✅ TASK STATUS
      };
    });

    currentIds = users.map((u) => u.id);
    generation++;
  }

  const team = Object.values(generations).flat();

  return {
    generations,
    team,
    totalTeamCount: team.length,
  };
}
