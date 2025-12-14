// app/api/user/package/upgrade/route.js
import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";
import { debitWallet, creditWallet } from "@/lib/walletService";

export async function POST(req) {
    try {
        // ---------------------------------
        // 1) AUTH USER
        // ---------------------------------
        const user = await getUser();
        if (!user) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { packageId } = body;

        if (!packageId) {
            return Response.json(
                { error: "Package ID missing" },
                { status: 400 }
            );
        }

        const userId = user.id;

        // ---------------------------------
        // 2) Load NEW package
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
        // 3) Load ACTIVE user package
        // ---------------------------------
        const activeUserPackage = await prisma.userPackage.findFirst({
            where: {
                userId,
                isActive: true,
            },
            include: {
                package: true,
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
        // 4) POSITION-BASED VALIDATION
        // ---------------------------------
        if (newPackage.position <= currentPackage.position) {
            return Response.json(
                { error: "Upgrade must be to a higher package" },
                { status: 400 }
            );
        }

        // ---------------------------------
        // 5) Check ACCOUNT wallet balance
        // ---------------------------------
        const wallet = await prisma.wallet.findUnique({
            where: { userId },
        });

        if (!wallet || wallet.mainWallet < newPackage.amount) {
            return Response.json(
                { error: "Insufficient account balance" },
                { status: 400 }
            );
        }

        // ---------------------------------
        // 6) ATOMIC TRANSACTION
        // ---------------------------------
        await prisma.$transaction(async () => {
            // 6.1 Debit ACCOUNT wallet (new package price)
            await debitWallet({
                userId,
                walletType: "ACCOUNT",
                amount: newPackage.amount,
                source: "PACKAGE_UPGRADE",
                note: `Upgrade to ${newPackage.name}`,
            });

            // 6.2 Return OLD package amount → RETURN wallet
            await creditWallet({
                userId,
                walletType: "RETURN",
                amount: activeUserPackage.amount,
                source: "PACKAGE_UPGRADE",
                note: `Returned old package (${currentPackage.name})`,
            });

            // 6.3 Credit DEPOSIT wallet → new package amount
            await creditWallet({
                userId,
                walletType: "DEPOSIT",
                amount: newPackage.amount,
                source: "PACKAGE_UPGRADE",
                note: `Activated new package (${newPackage.name})`,
            });

            // 6.4 Close old package
            await prisma.userPackage.update({
                where: { id: activeUserPackage.id },
                data: {
                    isActive: false,
                    endedAt: new Date(),
                },
            });

            // 6.5 Create new active package
            await prisma.userPackage.create({
                data: {
                    userId,
                    packageId: newPackage.id,
                    amount: newPackage.amount,
                    source: "self",
                    isActive: true,
                },
            });
        });

        return Response.json({ success: true });

    } catch (err) {
        console.error("❌ PACKAGE UPGRADE ERROR:", err);
        return Response.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}
