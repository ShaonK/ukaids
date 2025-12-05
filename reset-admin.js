import prisma from "./lib/prisma.js";
import bcrypt from "bcryptjs";

async function resetAdmin() {
    console.log("⏳ Resetting Admin Password...");

    const hashedPass = await bcrypt.hash("admin123", 10);

    await prisma.admin.update({
        where: { username: "admin" },
        data: { password: hashedPass }
    });

    console.log("✔ Admin Password Reset Successfully!");
    console.log("Login Now:");
    console.log("Username: admin");
    console.log("Password: admin123");
}

resetAdmin()
    .catch((err) => console.error(err))
    .finally(() => process.exit());
