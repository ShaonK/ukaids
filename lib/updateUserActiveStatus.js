// lib/updateUserActiveStatus.js
import prisma from "@/lib/prisma";

/**
 * Opens a new ACTIVE session history entry
 * Called when a user becomes active (deposit approve / manual activate)
 */
export async function openActiveHistory(userId, cause = "activated") {
    // Close previous active session (if any)
    await prisma.userStatusHistory.updateMany({
        where: {
            userId,
            status: "active",
            closedAt: null,
        },
        data: {
            closedAt: new Date(),
        },
    });

    // Create a new active session
    await prisma.userStatusHistory.create({
        data: {
            userId,
            status: "active",
            reason: cause,
            createdAt: new Date(),
        },
    });
}

/**
 * Auto-update: active / inactive + log reason
 */
export async function updateUserActiveStatus(userId) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            isActive: true,
            isBlocked: true,
            isSuspended: true,
        },
    });

    if (!user) return;

    let shouldBeActive = true;
    let reason = null;

    // 1️⃣ User blocked or suspended → always inactive
    if (user.isBlocked || user.isSuspended) {
        shouldBeActive = false;
        reason = "blocked_or_suspended";
    }

    // 2️⃣ No active earning → inactive
    const activeEarning = await prisma.roiEarning.findFirst({
        where: { userId, isActive: true },
    });

    if (!activeEarning) {
        shouldBeActive = false;
        if (!reason) reason = "no_active_roi";
    }

    // 3️⃣ Zero main wallet & no active earning → inactive
    const wallet = await prisma.wallet.findUnique({
        where: { userId },
        select: { mainWallet: true },
    });

    if (wallet.mainWallet <= 0 && !activeEarning) {
        shouldBeActive = false;
        if (!reason) reason = "no_balance_no_roi";
    }

    // No change → stop
    if (user.isActive === shouldBeActive) return shouldBeActive;

    // Update user active state
    await prisma.user.update({
        where: { id: userId },
        data: { isActive: shouldBeActive },
    });

    // Log history entry
    await prisma.userStatusHistory.create({
        data: {
            userId,
            status: shouldBeActive ? "active" : "inactive",
            reason: reason ?? "manual_state_change",
            createdAt: new Date(),
        },
    });

    return shouldBeActive;
}
