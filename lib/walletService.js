import prisma from "@/lib/prisma";

/**
 * Resolve wallet field name
 */
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

/**
 * CREDIT wallet (TX SAFE)
 */
export async function creditWallet({
  tx = prisma,
  userId,
  walletType,
  amount,
  source,
  referenceId = null,
  note = null,
}) {
  if (amount <= 0) throw new Error("Invalid credit amount");

  const wallet = await tx.wallet.findUnique({
    where: { userId },
  });

  if (!wallet) throw new Error("Wallet not found");

  const field = getWalletField(walletType);
  const before = wallet[field];
  const after = Number((before + amount).toFixed(6));

  await tx.wallet.update({
    where: { userId },
    data: { [field]: after },
  });

  await tx.walletTransaction.create({
    data: {
      userId,
      walletType,
      direction: "CREDIT",
      amount,
      balanceBefore: before,
      balanceAfter: after,
      source,
      referenceId,
      note,
    },
  });
}

/**
 * DEBIT wallet (TX SAFE)
 */
export async function debitWallet({
  tx = prisma,
  userId,
  walletType,
  amount,
  source,
  referenceId = null,
  note = null,
}) {
  if (amount <= 0) throw new Error("Invalid debit amount");

  const wallet = await tx.wallet.findUnique({
    where: { userId },
  });

  if (!wallet) throw new Error("Wallet not found");

  const field = getWalletField(walletType);
  const before = wallet[field];

  if (before < amount) {
    throw new Error("Insufficient balance");
  }

  const after = Number((before - amount).toFixed(6));

  await tx.wallet.update({
    where: { userId },
    data: { [field]: after },
  });

  await tx.walletTransaction.create({
    data: {
      userId,
      walletType,
      direction: "DEBIT",
      amount,
      balanceBefore: before,
      balanceAfter: after,
      source,
      referenceId,
      note,
    },
  });
}
