// lib/walletService.js
import prisma from "@/lib/prisma";

function getWalletField(walletType) {
  switch (walletType) {
    case "ACCOUNT":
      return "mainWallet";
    case "DEPOSIT":
      return "depositWallet";
    case "ROI":
      return "roiWallet";
    case "LEVEL":
      return "levelWallet";
    case "REFERRAL":
      return "referralWallet";
    case "RETURN":
      return "returnWallet";
    default:
      throw new Error("Invalid wallet type");
  }
}

function toNumber(val) {
  return Number(val || 0);
}

export async function creditWallet({
  tx,
  userId,
  walletType,
  amount,
  source,
  referenceId = null,
  note = null,
}) {
  const db = tx ?? prisma;

  const wallet = await db.wallet.findUnique({ where: { userId } });
  if (!wallet) throw new Error("Wallet not found");

  const field = getWalletField(walletType);
  const before = toNumber(wallet[field]);
  const after = Number((before + toNumber(amount)).toFixed(6));

  await db.wallet.update({
    where: { userId },
    data: { [field]: after },
  });

  await db.walletTransaction.create({
    data: {
      userId,
      walletType,
      direction: "CREDIT",
      amount: toNumber(amount),
      balanceBefore: before,
      balanceAfter: after,
      source,
      referenceId,
      note,
    },
  });
}

export async function debitWallet({
  tx,
  userId,
  walletType,
  amount,
  source,
  referenceId = null,
  note = null,
}) {
  const db = tx ?? prisma;

  const wallet = await db.wallet.findUnique({ where: { userId } });
  if (!wallet) throw new Error("Wallet not found");

  const field = getWalletField(walletType);
  const before = toNumber(wallet[field]);

  if (before < amount) throw new Error("Insufficient balance");

  const after = Number((before - toNumber(amount)).toFixed(6));

  await db.wallet.update({
    where: { userId },
    data: { [field]: after },
  });

  await db.walletTransaction.create({
    data: {
      userId,
      walletType,
      direction: "DEBIT",
      amount: toNumber(amount),
      balanceBefore: before,
      balanceAfter: after,
      source,
      referenceId,
      note,
    },
  });
}
