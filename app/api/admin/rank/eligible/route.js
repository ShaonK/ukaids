import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { VIP_RANKS } from "@/lib/vipConfig";

/**
 * Build referral map once (IN MEMORY)
 */
function buildReferralMap(users) {
  const map = new Map();

  for (const u of users) {
    if (!map.has(u.referredBy)) {
      map.set(u.referredBy, []);
    }
    map.get(u.referredBy).push(u.id);
  }

  return map;
}

/**
 * Recursive team count using MEMORY (NO EXTRA DB CALL)
 */
function countTeamFromMap(userId, map) {
  const children = map.get(userId) || [];
  let total = children.length;

  for (const childId of children) {
    total += countTeamFromMap(childId, map);
  }

  return total;
}

export async function GET() {
  try {
    /**
     * ✅ ONE DB QUERY ONLY (ADMIN SAFE)
     */
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        referredBy: true,
        userRank: {
          select: {
            rank: true,
            assignedByAdmin: true,
          },
        },
      },
      take: 100, // admin safety
    });

    const referralMap = buildReferralMap(users);

    const eligibleUsers = [];
    const candidateUsers = [];
    const assignedUsers = [];

    for (const user of users) {
      const directCount = (referralMap.get(user.id) || []).length;
      const teamCount = countTeamFromMap(user.id, referralMap);

      // ✅ Already assigned by admin
      if (user.userRank?.assignedByAdmin) {
        assignedUsers.push({
          userId: user.id,
          username: user.username,
          rank: user.userRank.rank,
          directCount,
          teamCount,
          assigned: true,
        });
        continue;
      }

      // 🔍 Find eligible rank
      let eligibleRule = null;
      for (const rule of VIP_RANKS) {
        if (
          directCount >= rule.direct &&
          teamCount >= rule.team
        ) {
          eligibleRule = rule;
        }
      }

      if (eligibleRule) {
        eligibleUsers.push({
          userId: user.id,
          username: user.username,
          eligibleRank: eligibleRule.rank,
          directCount,
          teamCount,
          assigned: false,
        });
      } else if (directCount > 0) {
        candidateUsers.push({
          userId: user.id,
          username: user.username,
          directCount,
          teamCount,
        });
      }
    }

    return NextResponse.json({
      success: true,
      eligibleUsers,
      candidateUsers,
      assignedUsers,
    });
  } catch (error) {
    console.error("ADMIN RANK ELIGIBLE ERROR:", error);
    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}
