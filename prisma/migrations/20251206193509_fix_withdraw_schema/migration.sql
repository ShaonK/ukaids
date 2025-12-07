/*
  Warnings:

  - You are about to drop the `approveddeposit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `rejecteddeposit` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `walletType` on table `withdraw` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `approveddeposit` DROP FOREIGN KEY `ApprovedDeposit_userId_fkey`;

-- DropForeignKey
ALTER TABLE `rejecteddeposit` DROP FOREIGN KEY `RejectedDeposit_userId_fkey`;

-- AlterTable
ALTER TABLE `withdraw` MODIFY `walletType` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `approveddeposit`;

-- DropTable
DROP TABLE `rejecteddeposit`;
