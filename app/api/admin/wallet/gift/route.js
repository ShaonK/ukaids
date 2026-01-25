import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdmin } from "@/lib/getAdmin";
import { Prisma } from "@prisma/client";

export async function POST(req) {
  try {
    const admin = await getAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId, amount, note } = await req.json();

    const creditAmount = new Prisma.Decimal(amount || 0);
    if (!userId || creditAmount.lte(0)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const wallet = await prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    // ✅ CORRECT DECIMAL HANDLING
    const before = new Prisma.Decimal(wallet.donationWallet);
    const after = before.plus(creditAmount);

    await prisma.$transaction([
      prisma.wallet.update({
        where: { userId },
        data: {
          donationWallet: after, // ✅ Prisma.Decimal
        },
      }),

      prisma.walletTransaction.create({
        data: {
          userId,
          walletType: "donationWallet",
          direction: "IN",
          amount: creditAmount,
          balanceBefore: before,
          balanceAfter: after,
          source: "ADMIN_GIFT",
          note,
        },
      }),

      prisma.adminAuditLog.create({
        data: {
          adminId: admin.id,
          action: "ADMIN_GIFT",
          targetType: "USER_WALLET",
          targetId: userId,
          oldValue: { donationWallet: before.toString() },
          newValue: { donationWallet: after.toString() },
        },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Gift error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
