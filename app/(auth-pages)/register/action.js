"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export default async function registerAction(formData) {
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

    // 1. Required fields check
    if (
        !fullname ||
        !username ||
        !referral ||
        !mobile ||
        !password ||
        !cpassword ||
        !tpassword
    ) {
        return { success: false, message: "All fields are required!" };
    }

    // 2. Captcha check
    if (captcha !== "1234") {
        return { success: false, message: "Invalid Captcha!" };
    }

    // 3. Confirm password check
    if (password !== cpassword) {
        return { success: false, message: "Passwords do not match!" };
    }

    // 4. Username unique check
    const userExists = await prisma.user.findUnique({
        where: { username },
    });

    if (userExists) {
        return { success: false, message: "Username already exists!" };
    }

    // 5. Referral validation
    const refUser = await prisma.user.findUnique({
        where: { username: referral },
    });

    if (!refUser) {
        return { success: false, message: "Invalid Referral Code!" };
    }

    // 6. Hashing passwords
    const hashedPass = await bcrypt.hash(password, 10);
    const hashedTrx = await bcrypt.hash(tpassword, 10);

    // 7. Create user
    const newUser = await prisma.user.create({
        data: {
            fullname,
            username,
            mobile,
            email,
            password: hashedPass,
            txnPassword: hashedTrx,
            referralCode: referral,
            referredBy: refUser.id,
        },
    });

    // 8. Create wallet row automatically
    await prisma.wallet.create({
        data: { userId: newUser.id },
    });

    return { success: true, message: "Account created successfully!" };
}
