"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export default async function registerAction(form) {
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
        } = form;

        /* --------------------
           BASIC VALIDATION
        -------------------- */
        if (
            !fullname ||
            !username ||
            !referral ||
            !mobile ||
            !email ||
            !password ||
            !cpassword ||
            !tpassword
        ) {
            return {
                success: false,
                message: "All fields are required",
            };
        }

        if (password !== cpassword) {
            return {
                success: false,
                message: "Password & Confirm Password do not match",
            };
        }

        if (password.length < 6) {
            return {
                success: false,
                message: "Password must be at least 6 characters",
            };
        }

        if (tpassword.length < 4) {
            return {
                success: false,
                message: "Transaction password must be at least 4 digits",
            };
        }

        /* --------------------
           REFERRAL VALIDATION
        -------------------- */
        const refUser = await prisma.user.findUnique({
            where: { referralCode: referral },
            select: { id: true },
        });

        if (!refUser) {
            return {
                success: false,
                message: "Invalid referral code",
            };
        }

        /* --------------------
           DUPLICATE CHECK
        -------------------- */
        const exists = await prisma.user.findFirst({
            where: {
                OR: [
                    { username },
                    { email },
                    { mobile },
                ],
            },
        });

        if (exists) {
            return {
                success: false,
                message: "Username / Email / Mobile already exists",
            };
        }

        /* --------------------
           PASSWORD HASH
        -------------------- */
        const hashedPassword = await bcrypt.hash(password, 10);
        const hashedTPassword = await bcrypt.hash(tpassword, 10);

        /* --------------------
           CREATE USER
        -------------------- */
        const user = await prisma.user.create({
            data: {
                fullname,
                username,
                email,
                mobile,
                password: hashedPassword,
                transactionPassword: hashedTPassword,
                referredBy: refUser.id,
                isActive: false,
                isBlocked: false,
                isSuspended: false,
            },
        });

        /* --------------------
           CREATE WALLET
        -------------------- */
        await prisma.wallet.create({
            data: {
                userId: user.id,
                mainWallet: 0,
                depositWallet: 0,
                roiWallet: 0,
                referralWallet: 0,
                levelWallet: 0,
                returnWallet: 0,
                salaryWallet: 0,
                donationWallet: 0,
            },
        });

        return {
            success: true,
            message: "Registration successful. Please login.",
        };

    } catch (err) {
        console.error("REGISTER ACTION ERROR:", err);
        return {
            success: false,
            message: "Registration failed. Try again later.",
        };
    }
}
