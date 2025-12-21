import prisma from "@/lib/prisma";

export async function createAuditLog({
    adminId,
    action,
    targetType,
    targetId = null,
    oldValue = null,
    newValue = null,
}) {
    await prisma.adminAuditLog.create({
        data: {
            adminId,
            action,
            targetType,
            targetId,
            oldValue,
            newValue,
        },
    });
}
