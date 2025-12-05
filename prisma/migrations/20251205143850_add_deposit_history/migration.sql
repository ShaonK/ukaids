/*
  Warnings:

  - Made the column `fullname` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `fullname` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `DepositHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `depositId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `amount` DOUBLE NOT NULL,
    `trxId` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `processedBy` INTEGER NOT NULL,
    `processedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DepositHistory` ADD CONSTRAINT `DepositHistory_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DepositHistory` ADD CONSTRAINT `DepositHistory_depositId_fkey` FOREIGN KEY (`depositId`) REFERENCES `Deposit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
