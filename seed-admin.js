import prisma from "./lib/prisma.js";
import bcrypt from "bcryptjs";

async function createAdmin() {
    console.log("⏳ Creating Admin...");

    const hashedPass = await bcrypt.hash("admin123", 10);

    const admin = await prisma.admin.create({
        data: {
            username: "admin",
            password: hashedPass,
        }
    });

    console.log("✔ Admin created successfully!");
    console.log("=========================================");
    console.log("Admin Login Credentials:");
    console.log("Username: admin");
    console.log("Password: admin123");
    console.log("=========================================");
}

createAdmin()
    .catch((err) => console.error(err))
    .finally(() => process.exit());
