// lib/vipConfig.js
import { VipRank } from "@prisma/client";

/**
 * VIP Rank Configuration
 * salary = monthly
 * lifetime = true → never expires
 */

export const VIP_RANKS = [
  { rank: VipRank.STAR_1, direct: 10, team: 0, salary: 40, lifetime: false },
  { rank: VipRank.STAR_2, direct: 25, team: 0, salary: 120, lifetime: false },
  { rank: VipRank.STAR_3, direct: 25, team: 125, salary: 400, lifetime: false },
  { rank: VipRank.STAR_4, direct: 25, team: 750, salary: 1000, lifetime: false },
  { rank: VipRank.STAR_5, direct: 25, team: 2250, salary: 2000, lifetime: false },
  { rank: VipRank.STAR_6, direct: 25, team: 6750, salary: 4000, lifetime: false },
  { rank: VipRank.STAR_7, direct: 25, team: 13500, salary: 8000, lifetime: true },
];
