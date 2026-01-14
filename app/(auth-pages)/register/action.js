"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";

/* --------------------
   STRONG REFERRAL CODE GEN
-------------------- */
function generateReferralCode() {
  return crypto.randomBytes(4).toString("hex").toUpperCase();
}

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
    } = form;

    /* --------------------
       BASIC VALIDATION
    -------------------- */
    if (
      !fullname ||
      !username ||
      !mobile ||
      !password ||
      !cpassword ||
      !tpassword
    ) {
      return { success: false, message: "All required fields must be filled" };
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
       (ONLY ACTIVE USERS)
    -------------------- */
    let refUser = null;

    if (referral) {
      const refValue = referral.trim();

      refUser = await prisma.user.findFirst({
        where: {
          referralCode: {
            equals: refValue,
            mode: "insensitive",
          },
          isActive: true,
          isBlocked: false,
          isSuspended: false,
        },
        select: { id: true },
      });

      if (!refUser) {
        return {
          success: false,
          message: "Invalid or inactive referral code",
        };
      }
    }

    /* --------------------
       DUPLICATE CHECK
    -------------------- */
    const exists = await prisma.user.findFirst({
      where: {
        OR: [
          { username: username.toLowerCase() },
          email ? { email } : undefined,
          { mobile },
        ].filter(Boolean),
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

    const myReferralCode = generateReferralCode();

    /* --------------------
       CREATE USER + WALLET
    -------------------- */
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          fullname,
          username: username.toLowerCase(),
          email: email || null,
          mobile,
          password: hashedPassword,
          txnPassword: hashedTPassword,
          referralCode: myReferralCode,
          referredBy: refUser?.id || null,
          isActive: false,
          isBlocked: false,
          isSuspended: false,
        },
      });

      await tx.wallet.create({
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
    });

    return {
      success: true,
      message: "Registration successful. Please login.",
    };
  } catch (err) {
    console.error("REGISTER ACTION ERROR:", err);
    return {
      success: false,
      message: err.message || "Registration failed. Try again later.",
    };
  }
}
