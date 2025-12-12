"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

/**
 * Registration Action
 * - Enforces: active referrer only
 * - Validates uniqueness: username, email (if provided), mobile
 * - Creates wallet row
 * - Generates unique referralCode for new user
 */

function generateReferralCode(len = 6) {
    const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789"; // avoid ambiguous chars
    let code = "";
    for (let i = 0; i < len; i++) code += chars[Math.floor(Math.random() * chars.length)];
    return code;
}

async function ensureUniqueReferralCode() {
    let code = generateReferralCode();
    // try a few times to avoid infinite loop
    for (let i = 0; i < 6; i++) {
        const exists = await prisma.user.findFirst({ where: { referralCode: code } });
        if (!exists) return code;
        code = generateReferralCode();
    }
    // fallback: append timestamp
    return `${code}${Date.now().toString().slice(-4)}`;
}

export default async function registerAction(formData) {
    try {
        const {
            fullname,
            username,
            referral,
            mobile,
            email,
            password,
            cpassword,
            tpassword,
            captcha,
        } = formData;

        // 1) Required fields
        if (!fullname || !username || !referral || !mobile || !password || !cpassword || !tpassword) {
            return { success: false, message: "All fields are required!" };
        }

        // 2) Simple captcha check (keep existing behavior)
        if (captcha !== "1234") {
            return { success: false, message: "Invalid Captcha!" };
        }

        // 3) Password confirm
        if (password !== cpassword) {
            return { success: false, message: "Passwords do not match!" };
        }

        // 4) Username uniqueness
        const userExists = await prisma.user.findUnique({ where: { username } });
        if (userExists) {
            return { success: false, message: "Username already exists!" };
        }

        // 5) Mobile uniqueness
        const mobileExists = await prisma.user.findFirst({ where: { mobile } });
        if (mobileExists) {
            return { success: false, message: "Mobile number already used!" };
        }

        // 6) Email uniqueness (if provided)
        if (email) {
            const emailExists = await prisma.user.findFirst({ where: { email } });
            if (emailExists) {
                return { success: false, message: "Email already used!" };
            }
        }

        // 7) Referral validation — MUST be an ACTIVE user
        // We accept referral input as either a referralCode OR a username (backwards-compatible).
        let refUser = null;

        // First try referralCode exact match
        refUser = await prisma.user.findFirst({
            where: {
                referralCode: referral,
            },
            select: { id: true, isActive: true, isBlocked: true, isSuspended: true },
        });

        // If not found by referralCode, try username (legacy)
        if (!refUser) {
            refUser = await prisma.user.findFirst({
                where: {
                    username: referral,
                },
                select: { id: true, isActive: true, isBlocked: true, isSuspended: true },
            });
        }

        if (!refUser) {
            return { success: false, message: "Invalid Referral Code!" };
        }

        // Referrer must be active and not blocked/suspended
        if (!refUser.isActive || refUser.isBlocked || refUser.isSuspended) {
            return { success: false, message: "Referrer is not active. Use an active referral code." };
        }

        // 8) Hash passwords
        const hashedPass = await bcrypt.hash(password, 10);
        const hashedTrx = await bcrypt.hash(tpassword, 10);

        // 9) Generate referralCode for new user (ensure server-side uniqueness)
        const newReferralCode = await ensureUniqueReferralCode();

        // 10) Create user inside a transaction: create user + wallet
        const newUser = await prisma.$transaction(async (tx) => {
            const u = await tx.user.create({
                data: {
                    fullname,
                    username,
                    mobile,
                    email: email || null,
                    password: hashedPass,
                    txnPassword: hashedTrx,
                    referralCode: newReferralCode,
                    referredBy: refUser.id,
                    // isActive remains default (false) — activation happens on deposit approve
                },
            });

            await tx.wallet.create({
                data: { userId: u.id },
            });

            return u;
        });

        return { success: true, message: "Account created successfully!" };
    } catch (err) {
        console.error("REGISTER_ERROR:", err);
        return { success: false, message: "Server error. Try again later." };
    }
}
