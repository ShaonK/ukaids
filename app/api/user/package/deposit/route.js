// app/api/user/package/deposit/route.js
import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";
import { debitWallet, creditWallet } from "@/lib/walletService";

export async function POST(req) {
    try {
        // 🔐 AUTH USER
        const user = await getUser();
        if (!user) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { packageId } = body;

        if (!packageId) {
            return Response.json(
                { error: "Package ID is required" },
                { status: 400 }
            );
        }

        const userId = user.id;

        // ---------------------------------
        // 1) Load package
        // ---------------------------------
        const pkg = await prisma.package.findUnique({
            where: { id: Number(packageId) },
        });

        if (!pkg || !pkg.isActive) {
            return Response.json(
                { error: "Invalid or inactive package" },
                { status: 400 }
            );
        }

        const amount = Number(pkg.amount);

        // ---------------------------------
        // 2) Load wallet
        // ---------------------------------
        const wallet = await prisma.wallet.findUnique({
            where: { userId },
        });

        if (!wallet || wallet.mainWallet < amount) {
            return Response.json(
                { error: "Insufficient account balance" },
                { status: 400 }
            );
        }

        // ---------------------------------
        // 3) Check active package
        // ---------------------------------
        const activePkg = await prisma.userPackage.findFirst({
            where: {
                userId,
                isActive: true,
            },
        });

        if (activePkg) {
            return Response.json(
                { error: "Active package exists. Upgrade required." },
                { status: 400 }
            );
        }

        // ---------------------------------
        // 4) ATOMIC TRANSACTION
        // ---------------------------------
        await prisma.$transaction(async () => {
            // 4.1 Debit ACCOUNT wallet
            await debitWallet({
                userId,
                walletType: "ACCOUNT",
                amount,
                source: "PACKAGE_DEPOSIT",
                note: `Package purchase (${pkg.name})`,
            });

            // 4.2 Credit DEPOSIT wallet
            await creditWallet({
                userId,
                walletType: "DEPOSIT",
                amount,
                source: "PACKAGE_DEPOSIT",
                note: `Package activated (${pkg.name})`,
            });

            // 4.3 Create active user package
            await prisma.userPackage.create({
                data: {
                    userId,
                    packageId: pkg.id,
                    amount,
                    source: "self",
                    isActive: true,
                },
            });
        });

        return Response.json({ success: true });

    } catch (err) {
        console.error("❌ PACKAGE DEPOSIT ERROR:", err);
        return Response.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}
