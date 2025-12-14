import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyUserFromToken } from "@/lib/auth";

export async function POST(req) {
  try {
    const { packageId } = await req.json();

    if (!packageId) {
      return NextResponse.json(
        { error: "Package ID missing" },
        { status: 400 }
      );
    }

    // 🔐 AUTH
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const user = await verifyUserFromToken(token);
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = user.id;

    // 🔎 PACKAGE CHECK
    const newPackage = await prisma.package.findUnique({
      where: { id: packageId },
    });

    if (!newPackage) {
      return NextResponse.json(
        { error: "Package not found" },
        { status: 404 }
      );
    }

    await prisma.$transaction(async (tx) => {
      // 1️⃣ WALLET FETCH
      const wallet = await tx.wallet.findUnique({
        where: { userId },
      });

      if (!wallet || wallet.mainWallet < newPackage.amount) {
        throw new Error("Insufficient balance");
      }

      // 2️⃣ CURRENT ACTIVE PACKAGE
      const activeUserPackage = await tx.userPackage.findFirst({
        where: { userId, isActive: true },
      });

      // 3️⃣ CLOSE OLD PACKAGE + REFUND
      if (activeUserPackage) {
        const returnBefore = wallet.returnWallet;
        const refundAmount = activeUserPackage.amount;

        // return old package amount
        await tx.wallet.update({
          where: { userId },
          data: {
            returnWallet: { increment: refundAmount },
          },
        });

        await tx.walletTransaction.create({
          data: {
            userId,
            walletType: "RETURN",
            direction: "CREDIT",
            amount: refundAmount,
            balanceBefore: returnBefore,
            balanceAfter: returnBefore + refundAmount,
            source: "package-upgrade",
            referenceId: activeUserPackage.id,
            note: "Refund previous package on upgrade",
          },
        });

        // close old package
        await tx.userPackage.update({
          where: { id: activeUserPackage.id },
          data: {
            isActive: false,
            endedAt: new Date(),
          },
        });
      }

      // 4️⃣ DEDUCT MAIN WALLET
      const mainBefore = wallet.mainWallet;

      await tx.wallet.update({
        where: { userId },
        data: {
          mainWallet: { decrement: newPackage.amount },
        },
      });

      await tx.walletTransaction.create({
        data: {
          userId,
          walletType: "ACCOUNT",
          direction: "DEBIT",
          amount: newPackage.amount,
          balanceBefore: mainBefore,
          balanceAfter: mainBefore - newPackage.amount,
          source: "package-upgrade",
          referenceId: newPackage.id,
          note: "New package purchase (upgrade)",
        },
      });

      // 5️⃣ 🔥 REPLACE DEPOSIT WALLET (NO MERGE)
      const depositBefore = wallet.depositWallet;

      await tx.wallet.update({
        where: { userId },
        data: {
          depositWallet: newPackage.amount, // ✅ REPLACED
        },
      });

      await tx.walletTransaction.create({
        data: {
          userId,
          walletType: "DEPOSIT",
          direction: "CREDIT",
          amount: newPackage.amount,
          balanceBefore: depositBefore,
          balanceAfter: newPackage.amount,
          source: "package-upgrade",
          referenceId: newPackage.id,
          note: "Deposit replaced on package upgrade",
        },
      });

      // 6️⃣ CREATE NEW ACTIVE PACKAGE
      await tx.userPackage.create({
        data: {
          userId,
          packageId: newPackage.id,
          amount: newPackage.amount,
          isActive: true,
          source: "self",
        },
      });
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Upgrade failed" },
      { status: 500 }
    );
  }
}
