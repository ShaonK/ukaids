import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * 🔥 SINGLE SOURCE OF TRUTH
 * শুধু এই array change করলেই সব update হবে
 */
const PACKAGES = [
    { name: "Silver", amount: 25 },
    { name: "Silver Plus", amount: 50 },
    { name: "Gold", amount: 100 },
    { name: "Gold Plus", amount: 250 },
    { name: "Platinum", amount: 500 },

    // 🔒 UPCOMING (no upgrade beyond this)
    { name: "Diamond", amount: 1000 },
    { name: "Diamond Plus", amount: 2500 },
    { name: "Elite", amount: 5000 },
    { name: "Elite Pro", amount: 10000 },
    { name: "Ultimate", amount: 20000 },
];

async function main() {
    console.log("🚀 Seeding packages...");

    for (let i = 0; i < PACKAGES.length; i++) {
        const pkg = PACKAGES[i];

        await prisma.package.upsert({
            where: { name: pkg.name }, // name is UNIQUE
            update: {
                amount: pkg.amount,
                position: i + 1,
                isActive: pkg.amount <= 500, // 🔥 CORE RULE
            },
            create: {
                name: pkg.name,
                amount: pkg.amount,
                position: i + 1,
                isActive: pkg.amount <= 500,
            },
        });

        console.log(
            `✅ ${pkg.name} | ${pkg.amount} | ${pkg.amount <= 500 ? "ACTIVE" : "UPCOMING"
            }`
        );
    }

    console.log("🎉 Package seed completed");
}

main()
    .catch((err) => {
        console.error("❌ Package seed failed:", err);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
