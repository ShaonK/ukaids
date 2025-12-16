import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";
import { debitWallet, creditWallet } from "@/lib/walletService";

export async function POST() {
    try {
        const user = await getUser();

        if (!user) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 🔒 User state check
        if (!user.isActive || user.isBlocked || user.isSuspended) {
            return Response.json(
                { error: "Account not eligible for wallet move" },
                { status: 403 }
            );
        }

        // 🔒 Active package required (UserPackage based)
        const activePackage = await prisma.userPackage.findFirst({
            where: {
                userId: user.id,
                isActive: true, // ✅ FIXED
            },
        });

        if (!activePackage) {
            return Response.json(
                { error: "At least one active package required" },
                { status: 400 }
            );
        }

        // 🔍 Wallet load
        const wallet = await prisma.wallet.findUnique({
            where: { userId: user.id },
        });

        if (!wallet) {
            return Response.json({ error: "Wallet not found" }, { status: 404 });
        }

        // 🧮 Income wallets (deposit excluded)
        const incomeWallets = [
            { type: "ROI", amount: Number(wallet.roiWallet) },
            { type: "LEVEL", amount: Number(wallet.levelWallet) },
            { type: "REFERRAL", amount: Number(wallet.referralWallet) },
            { type: "RETURN", amount: Number(wallet.returnWallet) },
        ];

        const totalAmount = incomeWallets.reduce(
            (sum, w) => sum + w.amount,
            0
        );

        if (totalAmount <= 0) {
            return Response.json(
                { error: "No income balance to move" },
                { status: 400 }
            );
        }

        // 🔁 Atomic transaction
        await prisma.$transaction(async (tx) => {
            // 1️⃣ Debit each income wallet
            for (const w of incomeWallets) {
                if (w.amount > 0) {
                    await debitWallet({
                        tx,
                        userId: user.id,
                        walletType: w.type,
                        amount: w.amount,
                        source: "WALLET_MOVE",
                        note: `Move ${w.type} to ACCOUNT`,
                    });
                }
            }

            // 2️⃣ Credit ACCOUNT wallet
            await creditWallet({
                tx,
                userId: user.id,
                walletType: "ACCOUNT",
                amount: totalAmount,
                source: "WALLET_MOVE",
                note: "Income wallets moved to Account Balance",
            });
        });

        return Response.json({
            success: true,
            movedAmount: totalAmount,
            message: "Income wallets successfully moved to Account Balance",
        });

    } catch (err) {
        console.error("WALLET MOVE ERROR:", err);
        return Response.json(
            { error: err.message || "Wallet move failed" },
            { status: 500 }
        );
    }
}
