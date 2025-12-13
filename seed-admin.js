import prisma from "./lib/prisma.js";
import bcrypt from "bcryptjs";

async function createAdmin() {
    try {
        console.log("⏳ Removing old admin user...");

        // Force delete (ensure DB connection)
        await prisma.$connect();
        await prisma.admin.deleteMany({});   // DELETE OLD ADMIN

        console.log("🗑️ Old admin removed. Creating new admin...");

        const hashedPass = await bcrypt.hash("admin123", 10);

        await prisma.admin.create({
            data: {
                username: "admin",
                password: hashedPass,
            }
        });

        console.log("✔ Admin created successfully!");
        console.log("=========================================");
        console.log("Username: admin");
        console.log("Password: admin123");
        console.log("=========================================");

    } catch (err) {
        console.error("❌ ERROR:", err);
    } finally {
        await prisma.$disconnect();
        process.exit(0);
    }
}

createAdmin();
