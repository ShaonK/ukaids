import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const ADMINS = [
        {
            username: "adminS",
            password: "asdfg@12345",
        },
        {
            username: "adminF",
            password: "asdfgh@12345",
        },
    ];

    for (const adminData of ADMINS) {
        const { username, password } = adminData;

        // 🔎 Check if admin already exists
        const existingAdmin = await prisma.admin.findUnique({
            where: { username },
        });

        if (existingAdmin) {
            console.log(`⚠️ Admin '${username}' already exists. Skipping.`);
            continue;
        }

        // 🔐 Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // ➕ Create admin
        const admin = await prisma.admin.create({
            data: {
                username,
                password: hashedPassword,
            },
        });

        console.log(`🎉 Admin created: ${admin.username} (ID: ${admin.id})`);
    }
}

main()
    .catch((e) => {
        console.error("❌ Admin seed failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
