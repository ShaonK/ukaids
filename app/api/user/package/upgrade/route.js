// app/api/user/package/upgrade/route.js
import prisma from "@/lib/prisma";
import { debitWallet, creditWallet } from "@/lib/walletService";

export async function POST(req) {
    try {
        const body = await req.json();
        const { userId, packageId } = body;

        if (!userId || !packageId) {
            return Response.json(
                { error: "Missing userId or packageId" },
                { status: 400 }
            );
        }

        // ---------------------------------
        // 1) Load NEW package
        // ---------------------------------
        const newPackage = await prisma.package.findUnique({
            where: { id: Number(packageId) },
        });

        if (!newPackage || !newPackage.isActive) {
            return Response.json(
                { error: "Invalid or inactive package" },
                { status: 400 }
            );
        }

        // ---------------------------------
        // 2) Load ACTIVE user package
        // ---------------------------------
        const activeUserPackage = await prisma.userPackage.findFirst({
            where: {
                userId: Number(userId),
                isActive: true,
            },
            include: {
                package: true, // 🔴 needed for position check
            },
        });

        if (!activeUserPackage) {
            return Response.json(
                { error: "No active package found" },
                { status: 400 }
            );
        }

        const currentPackage = activeUserPackage.package;

        // ---------------------------------
        // 3) POSITION BASED UPGRADE VALIDATION ✅
        // ---------------------------------
        if (newPackage.position <= currentPackage.position) {
            return Response.json(
                { error: "Upgrade must be to a higher package" },
                { status: 400 }
            );
        }

        // ---------------------------------
        // 4) Check ACCOUNT wallet balance
        // ---------------------------------
        const wallet = await prisma.wallet.findUnique({
            where: { userId: Number(userId) },
        });

        if (!wallet || wallet.mainWallet < newPackage.amount) {
            return Response.json(
                { error: "Insufficient account balance" },
                { status: 400 }
            );
        }

        // ---------------------------------
        // 5) ATOMIC TRANSACTION
        // ---------------------------------
        await prisma.$transaction(async () => {
            // 5.1 Debit ACCOUNT wallet (new package price)
            await debitWallet({
                userId,
                walletType: "ACCOUNT",
                amount: newPackage.amount,
                source: "PACKAGE_UPGRADE",
                note: `Upgrade to ${newPackage.name}`,
            });

            // 5.2 Return OLD package amount → RETURN wallet
            await creditWallet({
                userId,
                walletType: "RETURN",
                amount: activeUserPackage.amount,
                source: "PACKAGE_UPGRADE",
                note: `Returned old package (${currentPackage.name})`,
            });

            // 5.3 Credit DEPOSIT wallet → new package amount
            await creditWallet({
                userId,
                walletType: "DEPOSIT",
                amount: newPackage.amount,
                source: "PACKAGE_UPGRADE",
                note: `Activated new package (${newPackage.name})`,
            });

            // 5.4 Close old package
            await prisma.userPackage.update({
                where: { id: activeUserPackage.id },
                data: {
                    isActive: false,
                    endedAt: new Date(),
                },
            });

            // 5.5 Create new active package
            await prisma.userPackage.create({
                data: {
                    userId,
                    packageId: newPackage.id,
                    amount: newPackage.amount,
                    source: "self",
                    isActive: true,
                },
            });

            // ❌ depositHistory intentionally removed
            // Package upgrade ≠ blockchain deposit
        });

        return Response.json({ success: true });

    } catch (err) {
        console.error("❌ PACKAGE UPGRADE ERROR:", err);
        return Response.json(
            { error: err.message || "Server error" },
            { status: 500 }
        );
    }
}
