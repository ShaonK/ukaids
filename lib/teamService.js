import prisma from "@/lib/prisma";

export async function getTeamData(rootUserId) {
  const genMap = {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
  };

  let currentGenIds = [rootUserId];

  for (let gen = 1; gen <= 5; gen++) {
    if (!currentGenIds.length) break;

    const users = await prisma.user.findMany({
      where: {
        referredBy: { in: currentGenIds },
      },
      select: {
        id: true,
        username: true,
        isActive: true,
      },
    });

    genMap[gen] = users.map((u) => ({
      ...u,
      generation: gen,
    }));

    currentGenIds = users.map((u) => u.id);
  }

  const allTeam = Object.values(genMap).flat();

  return {
    generations: genMap,
    team: allTeam,
    totalTeamCount: allTeam.length,
  };
}
