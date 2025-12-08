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

        // --------------------------------------------------------
        // 🔥 1) Check - Is this user's FIRST approved deposit?
        // --------------------------------------------------------
        const previousApproved = await prisma.approvedDeposit.findFirst({
            where: { userId }
        });

        const isFirstDeposit = !previousApproved;

        // --------------------------------------------------------
        // 🔥 2) UPDATE deposit status
        // --------------------------------------------------------
        await prisma.deposit.update({
            where: { id },
            data: { status: "approved" },
        });

        // --------------------------------------------------------
        // 🔥 3) Add deposit amount to USER main wallet
        // --------------------------------------------------------
        await prisma.wallet.update({
            where: { userId },
            data: {
                mainWallet: { increment: amount },
            },
        });

        // --------------------------------------------------------
        // 🔥 4) Add to depositHistory table
        // --------------------------------------------------------
        await prisma.depositHistory.create({
            data: {
                userId,
                depositId: id,
                amount,
                trxId: deposit.trxId,
                status: "approved",
                processedBy: 1, // TODO: admin ID
            },
        });

        // --------------------------------------------------------
        // 🔥 5) Insert into approvedDeposit table
        // --------------------------------------------------------
        await prisma.approvedDeposit.create({
            data: {
                userId,
                amount,
                trxId: deposit.trxId,
            },
        });

        // --------------------------------------------------------
        // 🔥 6) APPLY REFERRAL COMMISSION (ONLY FIRST DEPOSIT)
        // --------------------------------------------------------
        if (isFirstDeposit) {
            let level1 = deposit.user.referredBy;
            let level2 = null;
            let level3 = null;

            if (level1) {
                const parent = await prisma.user.findUnique({
                    where: { id: level1 }
                });

                if (parent?.referredBy) level2 = parent.referredBy;

                if (level2) {
                    const parent2 = await prisma.user.findUnique({
                        where: { id: level2 }
                    });

                    if (parent2?.referredBy) level3 = parent2.referredBy;
                }
            }

            // 🔹 Commission Amounts
            const c1 = amount * 0.10; // 10%
            const c2 = amount * 0.03; // 3%
            const c3 = amount * 0.02; // 2%

            // 🔹 LEVEL 1
            if (level1) {
                await prisma.wallet.update({
                    where: { userId: level1 },
                    data: {
                        referralWallet: { increment: c1 },
                    },
                });
            }

            // 🔹 LEVEL 2
            if (level2) {
                await prisma.wallet.update({
                    where: { userId: level2 },
                    data: {
                        referralWallet: { increment: c2 },
                    },
                });
            }

            // 🔹 LEVEL 3
            if (level3) {
                await prisma.wallet.update({
                    where: { userId: level3 },
                    data: {
                        referralWallet: { increment: c3 },
                    },
                });
            }
        }

        return Response.json({ success: true });

    } catch (err) {
        console.log(err);
        return Response.json({ error: "Server error" }, { status: 500 });
    }
}
