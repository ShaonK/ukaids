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
    case "SALARY":
      return "salaryWallet";
    case "DONATION":
      return "donationWallet";
    default:
      throw new Error("Invalid wallet type");
  }
}

function toNumber(val) {
  return Number(val || 0);
}

async function ensureWallet(db, userId) {
  let wallet = await db.wallet.findUnique({ where: { userId } });

  if (!wallet) {
    wallet = await db.wallet.create({
      data: {
        userId,
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
  }

  return wallet;
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
  userId = Number(userId);
  amount = toNumber(amount);

  if (!userId || amount <= 0) return;

  const wallet = await ensureWallet(db, userId);

  const field = getWalletField(walletType);
  const before = toNumber(wallet[field]);
  const after = Number((before + amount).toFixed(6));

  await db.wallet.update({
    where: { userId },
    data: { [field]: after },
  });

  await db.walletTransaction.create({
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
  userId = Number(userId);
  amount = toNumber(amount);

  if (!userId || amount <= 0) return;

  const wallet = await ensureWallet(db, userId);

  const field = getWalletField(walletType);
  const before = toNumber(wallet[field]);

  if (before < amount) {
    throw new Error("Insufficient balance");
  }

  const after = Number((before - amount).toFixed(6));

  await db.wallet.update({
    where: { userId },
    data: { [field]: after },
  });

  await db.walletTransaction.create({
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
