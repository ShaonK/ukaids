import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";

export async function GET() {
  try {
    const rootUser = await getUser();
    if (!rootUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    /**
     * genMap = {
     *   1: [{ id, username, isActive, generation: 1 }],
     *   2: [{ ... , generation: 2 }],
     *   ...
     * }
     */
    const genMap = {
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
    };

    let currentGenIds = [rootUser.id];

    // 🔁 Build generation tree (1 → 5)
    for (let gen = 1; gen <= 5; gen++) {
      // যদি আগের generation-এ কেউ না থাকে → পরের সব empty
      if (!currentGenIds.length) break;

      const users = await prisma.user.findMany({
        where: {
          referredBy: {
            in: currentGenIds,
          },
        },
        select: {
          id: true,
          username: true,
          isActive: true,
          referredBy: true,
          createdAt: true,
        },
      });

      // ✅ Always set generation (even if empty)
      genMap[gen] = users.map((u) => ({
        ...u,
        generation: gen,
      }));

      // next generation ids
      currentGenIds = users.map((u) => u.id);
    }

    // 🔁 Flatten all generations
    const allTeam = Object.values(genMap).flat();

    // 🔁 Wallet incomes (only if users exist)
    const wallets = allTeam.length
      ? await prisma.wallet.findMany({
          where: {
            userId: { in: allTeam.map((u) => u.id) },
          },
        })
      : [];

    // 🔁 Final team data
    const result = allTeam.map((u) => {
      const userWallets = wallets.filter(
        (w) => w.userId === u.id
      );

      return {
        id: u.id,
        username: u.username,
        isActive: u.isActive,
        generation: u.generation, // ✅ ALWAYS number (1–5)
        roiIncome: sum(userWallets, "ROI"),
        referralIncome: sum(userWallets, "REFERRAL"),
        levelIncome: sum(userWallets, "LEVEL"),
        totalIncome: sum(userWallets),
      };
    });

    return Response.json({
      generations: genMap,        // ✅ USE THIS for counts
      team: result,               // detailed list
      totalTeamCount: allTeam.length,
    });
  } catch (err) {
    console.error("TEAM API ERROR:", err);
    return Response.json(
      { error: "Failed to load team data" },
      { status: 500 }
    );
  }
}

/* ---------------- HELPERS ---------------- */

function sum(wallets, type) {
  return wallets
    .filter((w) => !type || w.type === type)
    .reduce((a, b) => a + Number(b.amount), 0);
}
