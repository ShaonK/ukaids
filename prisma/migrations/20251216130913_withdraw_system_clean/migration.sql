/*
  Warnings:

  - You are about to drop the column `address` on the `withdraw` table. All the data in the column will be lost.
  - You are about to drop the column `commission` on the `withdraw` table. All the data in the column will be lost.
  - You are about to drop the column `netAmount` on the `withdraw` table. All the data in the column will be lost.
  - You are about to drop the column `network` on the `withdraw` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `withdraw` DROP FOREIGN KEY `fk_withdraw_address`;

-- DropForeignKey
ALTER TABLE `withdraw` DROP FOREIGN KEY `fk_withdraw_user`;

-- AlterTable
ALTER TABLE `withdraw` DROP COLUMN `address`,
    DROP COLUMN `commission`,
    DROP COLUMN `netAmount`,
    DROP COLUMN `network`;

-- CreateIndex
CREATE INDEX `WithdrawRequest_status_idx` ON `WithdrawRequest`(`status`);

-- AddForeignKey
ALTER TABLE `Withdraw` ADD CONSTRAINT `Withdraw_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
