-- =========================
-- VIP RANK TABLE
-- =========================
CREATE TABLE "UserRank" (
  "id" SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL UNIQUE,
  "rank" INTEGER NOT NULL,
  "rankName" TEXT NOT NULL,
  "directCount" INTEGER NOT NULL DEFAULT 0,
  "teamCount" INTEGER NOT NULL DEFAULT 0,
  "salary" NUMERIC(18,6) NOT NULL DEFAULT 0,
  "isLifetime" BOOLEAN NOT NULL DEFAULT FALSE,
  "achievedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "salaryStartAt" TIMESTAMP,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT "UserRank_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id")
    ON DELETE CASCADE
);

-- =========================
-- SALARY PAYOUT HISTORY
-- =========================
CREATE TABLE "SalaryPayout" (
  "id" SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL,
  "rank" INTEGER NOT NULL,
  "amount" NUMERIC(18,6) NOT NULL,
  "paidForMonth" TEXT NOT NULL,
  "paidAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT "SalaryPayout_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id")
    ON DELETE CASCADE
);
