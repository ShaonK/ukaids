// lib/referralService.js
import prisma from "@/lib/prisma";
import { creditWallet } from "@/lib/walletService";

/**
 * Referral Commission Rules
 * L1 → 10%
 * L2 → 3%
 * L3 → 2%
 */
const RULES = [
  { level: 1, percent: 10 },
  { level: 2, percent: 3 },
  { level: 3, percent: 2 },
];

export async function distributeReferralCommission({
  tx = prisma,
  buyerId,
  packageAmount,
  source,
}) {
  // 🔎 Load buyer
  const buyer = await tx.user.findUnique({
    where: { id: buyerId },
    select: { referredBy: true },
  });

  if (!buyer?.referredBy) return;

  let currentReferrerId = buyer.referredBy;

  for (const rule of RULES) {
    if (!currentReferrerId) break;

    const refUser = await tx.user.findUnique({
      where: { id: currentReferrerId },
      select: {
        id: true,
        isActive: true,
        referredBy: true,
      },
    });

    if (!refUser) break;

    // ✅ Only ACTIVE users earn commission
    if (refUser.isActive) {
      const commission = Number(
        ((packageAmount * rule.percent) / 100).toFixed(6)
      );

      if (commission > 0) {
        // 💰 Credit referral wallet
        await creditWallet({
          tx,
          userId: refUser.id,
          walletType: "REFERRAL",
          amount: commission,
          source,
          note: `Referral L${rule.level} commission`,
        });

        // 🧾 Commission history
        await tx.referralCommissionHistory.create({
          data: {
            userId: refUser.id,      // receiver
            fromUserId: buyerId,     // buyer
            level: rule.level,
            commission,
          },
        });
      }
    }

    // 🔼 Move to upper level always
    currentReferrerId = refUser.referredBy;
  }
}
