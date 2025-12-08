import prisma from "@/lib/prisma";

export async function POST(req) {
    try {
        const { id } = await req.json();

        const deposit = await prisma.deposit.findUnique({
            where: { id },
            include: { user: true },
        });

        if (!deposit) {
            return Response.json({ error: "Deposit not found" }, { status: 400 });
        }

        if (deposit.status !== "pending") {
            return Response.json(
                { error: "This request is already processed" },
                { status: 400 }
            );
        }

        const userId = deposit.userId;
        const amount = deposit.amount;

        /* -----------------------------------------
           1️⃣ Approve Deposit
        -------------------------------------------- */
        await prisma.deposit.update({
            where: { id },
            data: { status: "approved" },
        });

        /* -----------------------------------------
           2️⃣ Add to Main Wallet
        -------------------------------------------- */
        await prisma.wallet.update({
            where: { userId },
            data: { mainWallet: { increment: amount } },
        });

        /* -----------------------------------------
           3️⃣ Add History
        -------------------------------------------- */
        await prisma.depositHistory.create({
            data: {
                userId,
                depositId: id,
                amount,
                trxId: deposit.trxId,
                status: "approved",
                processedBy: 1,
            },
        });

        /* -----------------------------------------
           4️⃣ Store ApprovedDeposit
        -------------------------------------------- */
        await prisma.approvedDeposit.create({
            data: {
                userId,
                amount,
                trxId: deposit.trxId,
            },
        });

        /* -----------------------------------------
           ⭐ 5️⃣ Referral Commission (EVERY DEPOSIT)
        -------------------------------------------- */

        // Level 1 → user's referrer
        let level1 = deposit.user.referredBy;
        let level2 = null;
        let level3 = null;

        // Level 2
        if (level1) {
            const p1 = await prisma.user.findUnique({ where: { id: level1 } });
            if (p1?.referredBy) level2 = p1.referredBy;
        }

        // Level 3
        if (level2) {
            const p2 = await prisma.user.findUnique({ where: { id: level2 } });
            if (p2?.referredBy) level3 = p2.referredBy;
        }

        // Commission %
        const c1 = amount * 0.10;
        const c2 = amount * 0.03;
        const c3 = amount * 0.02;

        if (level1) {
            await prisma.wallet.update({
                where: { userId: level1 },
                data: { referralWallet: { increment: c1 } },
            });
        }

        if (level2) {
            await prisma.wallet.update({
                where: { userId: level2 },
                data: { referralWallet: { increment: c2 } },
            });
        }

        if (level3) {
            await prisma.wallet.update({
                where: { userId: level3 },
                data: { referralWallet: { increment: c3 } },
            });
        }

        /* -----------------------------------------
           DONE
        -------------------------------------------- */

        return Response.json({ success: true });

    } catch (err) {
        console.log(err);
        return Response.json({ error: "Server error" }, { status: 500 });
    }
}
