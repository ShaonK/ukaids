process.env.NODE_OPTIONS = "--dns-result-order=ipv4first";

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const USERS = [
        {
            fullname: "Root One",
            username: "root1",
            referralCode: "ROOT1",
            mobile: "01700000011",
            password: "123456",
            txnPassword: "123456",
        },
        {
            fullname: "Root Two",
            username: "root2",
            referralCode: "ROOT2",
            mobile: "01700000022",
            password: "123456",
            txnPassword: "123456",
        },
    ];

    for (const u of USERS) {
        // 🔎 already exists?
        const exists = await prisma.user.findUnique({
            where: { username: u.username },
        });

        if (exists) {
            console.log(`⚠️ ${u.username} already exists, skipping`);
            continue;
        }

        const hashedPass = await bcrypt.hash(u.password, 10);
        const hashedTxn = await bcrypt.hash(u.txnPassword, 10);

        await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    fullname: u.fullname,
                    username: u.username,
                    referralCode: u.referralCode,
                    mobile: u.mobile,
                    password: hashedPass,
                    txnPassword: hashedTxn,
                    referredBy: null,   // ✅ ROOT USER
                    isActive: true,
                    isBlocked: false,
                    isSuspended: false,
                },
            });

            await tx.wallet.create({
                data: {
                    userId: user.id,
                },
            });

            console.log(
                `✅ Root user created: ${user.username} | referralCode=${user.referralCode}`
            );
        });
    }
}

main()
    .catch((e) => {
        console.error("❌ Root user seed failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
