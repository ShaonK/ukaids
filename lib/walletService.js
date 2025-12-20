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
 * INTERNAL: force number conversion
 */
function toNumber(val) {
  if (val === null || val === undefined) return 0;
  const n = Number(val);
  if (Number.isNaN(n)) return 0;
  return n;
}

/**
 * INTERNAL: resolve DB client safely
 */
function resolveDb(tx) {
  // if tx is missing or invalid, fallback to prisma
  if (!tx) return prisma;
  if (typeof tx.wallet === "undefined") return prisma;
  return tx;
}

/**
 * CREDIT wallet (TX SAFE + FALLBACK SAFE)
 */
export async function creditWallet({
  tx,
  userId,
  walletType,
  amount,
  source,
  referenceId = null,
  note = null,
}) {
  const db = resolveDb(tx);

  const add = toNumber(amount);
  if (add <= 0) throw new Error("Invalid credit amount");

  const wallet = await db.wallet.findUnique({
    where: { userId },
  });

  if (!wallet) throw new Error("Wallet not found");

  const field = getWalletField(walletType);

  const before = toNumber(wallet[field]);
  const after = Number((before + add).toFixed(6));

  await db.wallet.update({
    where: { userId },
    data: {
      [field]: after,
    },
  });

  await db.walletTransaction.create({
    data: {
      userId,
      walletType,
      direction: "CREDIT",
      amount: add,
      balanceBefore: before,
      balanceAfter: after,
      source,
      referenceId,
      note,
    },
  });
}

/**
 * DEBIT wallet (TX SAFE + FALLBACK SAFE)
 */
export async function debitWallet({
  tx,
  userId,
  walletType,
  amount,
  source,
  referenceId = null,
  note = null,
}) {
  const db = resolveDb(tx);

  const sub = toNumber(amount);
  if (sub <= 0) throw new Error("Invalid debit amount");

  const wallet = await db.wallet.findUnique({
    where: { userId },
  });

  if (!wallet) throw new Error("Wallet not found");

  const field = getWalletField(walletType);

  const before = toNumber(wallet[field]);

  if (before < sub) {
    throw new Error("Insufficient balance");
  }

  const after = Number((before - sub).toFixed(6));

  await db.wallet.update({
    where: { userId },
    data: {
      [field]: after,
    },
  });

  await db.walletTransaction.create({
    data: {
      userId,
      walletType,
      direction: "DEBIT",
      amount: sub,
      balanceBefore: before,
      balanceAfter: after,
      source,
      referenceId,
      note,
    },
  });
}
