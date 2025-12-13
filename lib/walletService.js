// lib/walletService.js
import prisma from "@/lib/prisma";

/**
 * Get wallet field name from type
 */
function getWalletField(walletType) {
    switch (walletType) {
        case "ACCOUNT":
            return "mainWallet";
        case "DEPOSIT":
            return "depositWallet";
        case "ROI":
            return "roiWallet";
        case "LEVEL":
            return "levelWallet";
        case "REFERRAL":
            return "referralWallet";
        case "RETURN":
            return "returnWallet";
        default:
            throw new Error("Invalid wallet type");
    }
}

/**
 * CREDIT wallet with full audit
 */
export async function creditWallet({
    userId,
    walletType,
    amount,
    source,
    referenceId = null,
    note = null,
}) {
    if (amount <= 0) throw new Error("Invalid credit amount");

    return prisma.$transaction(async (tx) => {
        const wallet = await tx.wallet.findUnique({
            where: { userId },
        });

        if (!wallet) throw new Error("Wallet not found");

        const field = getWalletField(walletType);
        const before = wallet[field];
        const after = Number((before + amount).toFixed(6));

        await tx.wallet.update({
            where: { userId },
            data: { [field]: after },
        });

        await tx.walletTransaction.create({
            data: {
                userId,
                walletType,
                direction: "CREDIT",
                amount,
                balanceBefore: before,
                balanceAfter: after,
                source,
                referenceId,
                note,
            },
        });

        return { before, after };
    });
}

/**
 * DEBIT wallet with full audit
 */
export async function debitWallet({
    userId,
    walletType,
    amount,
    source,
    referenceId = null,
    note = null,
}) {
    if (amount <= 0) throw new Error("Invalid debit amount");

    return prisma.$transaction(async (tx) => {
        const wallet = await tx.wallet.findUnique({
            where: { userId },
        });

        if (!wallet) throw new Error("Wallet not found");

        const field = getWalletField(walletType);
        const before = wallet[field];

        if (before < amount) {
            throw new Error("Insufficient balance");
        }

        const after = Number((before - amount).toFixed(6));

        await tx.wallet.update({
            where: { userId },
            data: { [field]: after },
        });

        await tx.walletTransaction.create({
            data: {
                userId,
                walletType,
                direction: "DEBIT",
                amount,
                balanceBefore: before,
                balanceAfter: after,
                source,
                referenceId,
                note,
            },
        });

        return { before, after };
    });
}
