import prisma from "./lib/prisma.js";
import bcrypt from "bcryptjs";

async function main() {
    console.log("⏳ Running Seeder...");

    // Check if root already exists
    const exists = await prisma.user.findUnique({
        where: { username: "root" },
    });

    if (exists) {
        console.log("✔ Root user already exists (ID:", exists.id + ")");
        return;
    }

    // Hash passwords
    const passwordHash = await bcrypt.hash("12345", 10);
    const txnPasswordHash = await bcrypt.hash("67890", 10);

    // Create root user
    const user = await prisma.user.create({
        data: {
            fullname: "Root User",
            username: "root",
            referralCode: "none",
            mobile: "0000000000",
            email: "root@mail.com",
            password: passwordHash,
            txnPassword: txnPasswordHash,
            isActive: true,
        },
    });

    // Create wallet for root user
    await prisma.wallet.create({
        data: { userId: user.id },
    });

    console.log("🎉 Root user created successfully!");
    console.log("🆔 User ID:", user.id);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Seeder failed:", error);
        process.exit(1);
    });
