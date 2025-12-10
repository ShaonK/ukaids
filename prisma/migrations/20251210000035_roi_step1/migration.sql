/*
  Warnings:

  - You are about to drop the `dailytask` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `dailytask` DROP FOREIGN KEY `DailyTask_userId_fkey`;

-- DropTable
DROP TABLE `dailytask`;

-- CreateTable
CREATE TABLE `UserDepositRoi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `depositId` INTEGER NOT NULL,
    `amount` DOUBLE NOT NULL,
    `roiPercent` DOUBLE NOT NULL DEFAULT 2,
    `nextRoiTime` DATETIME(3) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RoiHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `earningId` INTEGER NOT NULL,
    `amount` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roiearning` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `depositId` INTEGER NOT NULL,
    `amount` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `nextRun` DATETIME(3) NOT NULL,
    `totalEarned` DOUBLE NOT NULL DEFAULT 0,
    `maxEarnable` DOUBLE NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserDepositRoi` ADD CONSTRAINT `UserDepositRoi_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserDepositRoi` ADD CONSTRAINT `UserDepositRoi_depositId_fkey` FOREIGN KEY (`depositId`) REFERENCES `Deposit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RoiHistory` ADD CONSTRAINT `RoiHistory_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RoiHistory` ADD CONSTRAINT `RoiHistory_earningId_fkey` FOREIGN KEY (`earningId`) REFERENCES `roiearning`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `roiearning` ADD CONSTRAINT `roiearning_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `roiearning` ADD CONSTRAINT `roiearning_depositId_fkey` FOREIGN KEY (`depositId`) REFERENCES `Deposit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
