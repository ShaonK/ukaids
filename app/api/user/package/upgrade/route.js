// app/api/user/package/upgrade/route.js
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

    // 🔎 Load new package
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
      // 1️⃣ Wallet check
      const wallet = await tx.wallet.findUnique({
        where: { userId },
      });

      if (!wallet || wallet.mainWallet < newPackage.amount) {
        throw new Error("Insufficient balance");
      }

      // 2️⃣ Active package
      const activePkg = await tx.userPackage.findFirst({
        where: { userId, isActive: true },
      });

      // 3️⃣ Refund old package → return wallet
      if (activePkg) {
        await tx.wallet.update({
          where: { userId },
          data: {
            returnWallet: { increment: activePkg.amount },
          },
        });

        await tx.userPackage.update({
          where: { id: activePkg.id },
          data: {
            isActive: false,
            endedAt: new Date(),
          },
        });
      }

      // 4️⃣ Debit account wallet
      await tx.wallet.update({
        where: { userId },
        data: {
          mainWallet: { decrement: newPackage.amount },
        },
      });

      // 5️⃣ Update deposit wallet = active package amount (NO MERGE)
      await tx.wallet.update({
        where: { userId },
        data: {
          depositWallet: newPackage.amount,
        },
      });

      // 6️⃣ Create new active package
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
    console.error("UPGRADE ERROR:", err);
    return NextResponse.json(
      { error: err.message || "Upgrade failed" },
      { status: 500 }
    );
  }
}
