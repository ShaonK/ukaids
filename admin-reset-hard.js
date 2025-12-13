import prisma from "./lib/prisma.js";
import bcrypt from "bcryptjs";

async function resetAdmin() {
    console.log("⏳ Removing old admin and creating fresh one...");

    await prisma.admin.deleteMany(); // CLEAR ADMIN TABLE

    const hashed = await bcrypt.hash("admin123", 10);

    await prisma.admin.create({
        data: {
            username: "admin",
            password: hashed,
        }
    });

    console.log("✔ Fresh admin created!");
    console.log("Login:");
    console.log("Username: admin");
    console.log("Password: admin123");
}

resetAdmin().finally(() => process.exit());
