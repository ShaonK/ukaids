import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";

export async function GET() {
    try {
        const rootUser = await getUser();
        if (!rootUser) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        /**
         * Build generation tree
         * genMap = { 1: [...], 2: [...], ... }
         */
        const genMap = {};
        let currentGenIds = [rootUser.id];

        for (let gen = 1; gen <= 5; gen++) {
            const users = await prisma.user.findMany({
                where: {
                    referredBy: { in: currentGenIds },
                },
                select: {
                    id: true,
                    username: true,
                    isActive: true,
                    referredBy: true,
                    createdAt: true,
                },
            });

            if (!users.length) break;

            genMap[gen] = users;
            currentGenIds = users.map((u) => u.id);
        }

        // 🔁 Flatten all team members (ALL generations)
        const allTeam = Object.values(genMap).flat();

        // 🔁 Wallet incomes
        const wallets = await prisma.wallet.findMany({
            where: {
                userId: { in: allTeam.map((u) => u.id) },
            },
        });

        // 🔁 Attach income + generation
        const result = allTeam.map((u) => {
            const userWallets = wallets.filter((w) => w.userId === u.id);

            return {
                id: u.id,
                username: u.username,
                isActive: u.isActive,
                generation: getGeneration(u.id, genMap),
                roiIncome: sum(userWallets, "ROI"),
                referralIncome: sum(userWallets, "REFERRAL"),
                levelIncome: sum(userWallets, "LEVEL"),
                totalIncome: sum(userWallets),
            };
        });

        return Response.json({
            generations: genMap,
            team: result,
            totalTeamCount: allTeam.length, // ✅ ALL generations
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

function getGeneration(userId, genMap) {
    for (const gen in genMap) {
        if (genMap[gen].some((u) => u.id === userId)) {
            return Number(gen);
        }
    }
    return null;
}
