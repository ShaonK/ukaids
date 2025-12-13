// app/api/user/package/deposit/route.js
import prisma from "@/lib/prisma";
import { debitWallet, creditWallet } from "@/lib/walletService";

export async function POST(req) {
    try {
        const body = await req.json();
        const { userId, packageId } = body;

        if (!userId || !packageId) {
            return Response.json({ error: "Missing data" }, { status: 400 });
        }

        // ---------------------------------
        // 1) Load package
        // ---------------------------------
        const pkg = await prisma.package.findUnique({
            where: { id: Number(packageId) },
        });

        if (!pkg || !pkg.isActive) {
            return Response.json({ error: "Invalid package" }, { status: 400 });
        }

        const amount = pkg.amount;

        // ---------------------------------
        // 2) Load wallet
        // ---------------------------------
        const wallet = await prisma.wallet.findUnique({
            where: { userId },
        });

        if (!wallet || wallet.mainWallet < amount) {
            return Response.json({ error: "Insufficient balance" }, { status: 400 });
        }

        // ---------------------------------
        // 3) Check active package
        // ---------------------------------
        const activePkg = await prisma.userPackage.findFirst({
            where: { userId, isActive: true },
        });

        if (activePkg) {
            return Response.json(
                { error: "Active package exists. Upgrade required." },
                { status: 400 }
            );
        }

        // ---------------------------------
        // 4) TRANSACTION (ATOMIC)
        // ---------------------------------
        await prisma.$transaction(async () => {
            // DEBIT account balance
            await debitWallet({
                userId,
                walletType: "ACCOUNT",
                amount,
                source: "PACKAGE_DEPOSIT",
                note: `Package purchase (${pkg.name})`,
            });

            // CREDIT deposit wallet
            await creditWallet({
                userId,
                walletType: "DEPOSIT",
                amount,
                source: "PACKAGE_DEPOSIT",
                note: `Package activated (${pkg.name})`,
            });

            // create user package
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
        return Response.json({ error: "Server error" }, { status: 500 });
    }
}
