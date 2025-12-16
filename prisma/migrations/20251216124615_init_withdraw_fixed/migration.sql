/*
  Warnings:

  - You are about to drop the column `isActive` on the `withdrawaddress` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `WithdrawAddress` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `withdraw` DROP FOREIGN KEY `Withdraw_userId_fkey`;

-- AlterTable
ALTER TABLE `withdraw` ADD COLUMN `address` VARCHAR(191) NULL,
    ADD COLUMN `approvedAt` DATETIME(3) NULL,
    ADD COLUMN `commission` DOUBLE NULL,
    ADD COLUMN `netAmount` DOUBLE NULL,
    ADD COLUMN `network` VARCHAR(191) NULL,
    ADD COLUMN `rejectedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `withdrawaddress` DROP COLUMN `isActive`;

-- CreateIndex
CREATE UNIQUE INDEX `WithdrawAddress_userId_key` ON `WithdrawAddress`(`userId`);

-- AddForeignKey
ALTER TABLE `Withdraw` ADD CONSTRAINT `fk_withdraw_user` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Withdraw` ADD CONSTRAINT `fk_withdraw_address` FOREIGN KEY (`userId`) REFERENCES `WithdrawAddress`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;
