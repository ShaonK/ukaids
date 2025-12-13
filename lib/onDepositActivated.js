// lib/onDepositActivated.js
import prisma from "@/lib/prisma";

/**
 * Called whenever:
 * - New package activated
 * - Package upgraded
 * - Deposit wallet changed
 */
export async function onDepositActivated({ userId }) {
    // ---------------------------------
    // 1) Load active package
    // ---------------------------------
    const activePkg = await prisma.userPackage.findFirst({
        where: { userId, isActive: true },
    });

    if (!activePkg) {
        return; // no package, no ROI
    }

    // ---------------------------------
    // 2) Load wallet
    // ---------------------------------
    const wallet = await prisma.wallet.findUnique({
        where: { userId },
    });

    if (!wallet || wallet.depositWallet <= 0) {
        return;
    }

    const depositAmount = wallet.depositWallet;

    // ---------------------------------
    // 3) Check existing active ROI
    // ---------------------------------
    const existingRoi = await prisma.roiEarning.findFirst({
        where: {
            userId,
            isActive: true,
        },
    });

    // If ROI already running with same max → do nothing
    const maxEarnable = Number((depositAmount * 2).toFixed(6));

    if (existingRoi && existingRoi.maxEarnable === maxEarnable) {
        return;
    }

    // ---------------------------------
    // 4) Close old ROI if exists
    // ---------------------------------
    if (existingRoi) {
        await prisma.roiEarning.update({
            where: { id: existingRoi.id },
            data: { isActive: false },
        });
    }

    // ---------------------------------
    // 5) Start new ROI engine
    // ---------------------------------
    const roiPercent = 0.02;
    const roiAmount = Number((depositAmount * roiPercent).toFixed(6));
    const nextRun = new Date(Date.now() + 60 * 1000);

    const earning = await prisma.roiEarning.create({
        data: {
            userId,
            depositId: 0, // internal deposit
            amount: roiAmount,
            totalEarned: 0,
            maxEarnable,
            nextRun,
            isActive: true,
        },
    });

    // ---------------------------------
    // 6) Create ROI history (NO WALLET CREDIT HERE)
    // ---------------------------------
    await prisma.roiHistory.create({
        data: {
            userId,
            earningId: earning.id,
            amount: 0,
        },
    });
}
