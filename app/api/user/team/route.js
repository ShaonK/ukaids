import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";

export async function GET() {
  try {
    const rootUser = await getUser();
    if (!rootUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    /* -----------------------------
       1️⃣ BUILD GENERATION TREE
    ------------------------------*/
    const generations = {};
    let currentIds = [rootUser.id];
    let gen = 1;

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

      generations[gen] = users;
      currentIds = users.map((u) => u.id);
      gen++;
    }

    /* -----------------------------
       2️⃣ ALL TEAM USER IDS
    ------------------------------*/
    const allUsers = Object.values(generations).flat();
    const userIds = allUsers.map((u) => u.id);

    /* -----------------------------
       3️⃣ ACTIVE DEPOSITS
       (STRICT MLM RULE)
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

    const depositMap = {};
    activePackages.forEach((p) => {
      depositMap[p.userId] = Number(p.amount);
    });

    /* -----------------------------
       4️⃣ FORMAT FINAL DATA
    ------------------------------*/
    const team = [];
    let totalTeamDeposit = 0;

    Object.entries(generations).forEach(([generation, users]) => {
      users.forEach((u) => {
        const totalDeposit = depositMap[u.id] || 0;
        totalTeamDeposit += totalDeposit;

        team.push({
          id: u.id,
          username: u.username,
          isActive: u.isActive,
          generation: Number(generation),
          totalDeposit, // 🔥 THIS WAS MISSING
        });
      });
    });

    return Response.json({
      team,
      generations,
      totalTeamCount: team.length,
      totalTeamDeposit,
    });
  } catch (err) {
    console.error("TEAM API ERROR:", err);
    return Response.json(
      { error: "Failed to load team" },
      { status: 500 }
    );
  }
}
