"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

/* --------------------
   REFERRAL CODE GEN
-------------------- */
function generateReferralCode() {
  return Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase();
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
      return {
        success: false,
        message: "All required fields must be filled",
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
    let refUser = null;

    if (referral) {
      refUser = await prisma.user.findUnique({
        where: { referralCode: referral },
        select: { id: true },
      });

      if (!refUser) {
        return {
          success: false,
          message: "Invalid referral code",
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
          { email: email || undefined },
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
          txnPassword: hashedTPassword,          // ✅ FIXED
          referralCode: myReferralCode,           // ✅ REQUIRED
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
