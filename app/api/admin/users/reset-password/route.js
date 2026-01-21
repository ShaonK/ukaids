import prisma from "@/lib/prisma";
import { getAdmin } from "@/lib/getAdmin";
import bcrypt from "bcryptjs";

/* 🔐 random password generator */
function generatePassword(length = 10) {
    const chars =
        "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
    let pass = "";
    for (let i = 0; i < length; i++) {
        pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pass;
}

export async function POST(req) {
    try {
        const admin = await getAdmin();
        if (!admin) {
            return Response.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { userId } = await req.json();
        if (!userId || isNaN(Number(userId))) {
            return Response.json(
                { error: "Invalid user ID" },
                { status: 400 }
            );
        }

        const newPassword = generatePassword(10);
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.$transaction([
            // 🔁 update user password
            prisma.user.update({
                where: { id: Number(userId) },
                data: { password: hashedPassword },
            }),

            // 🧾 audit log
            prisma.adminAuditLog.create({
                data: {
                    adminId: admin.id,
                    action: "USER_PASSWORD_RESET",
                    targetType: "User",
                    targetId: Number(userId),
                },
            }),
        ]);

        // ⚠️ password only returned ONCE
        return Response.json({
            success: true,
            password: newPassword,
        });
    } catch (err) {
        console.error("RESET PASSWORD ERROR:", err);
        return Response.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}
