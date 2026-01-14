// scripts/autoRankAllUsers.js
import prisma from "../lib/prisma.js";
import { evaluateUserRank } from "../lib/rankEngine.js";

async function run() {
  console.log("🔄 Running auto rank engine for all users...");

  const users = await prisma.user.findMany({
    where: { isActive: true },
    select: { id: true },
  });

  for (const user of users) {
    await evaluateUserRank(user.id);
    console.log(`✅ Rank evaluated for user ID: ${user.id}`);
  }

  console.log("🎉 All eligible users ranked successfully");
  process.exit(0);
}

run().catch((err) => {
  console.error("❌ Auto rank engine failed:", err);
  process.exit(1);
});
