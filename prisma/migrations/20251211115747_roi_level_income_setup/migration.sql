-- AlterTable
ALTER TABLE `roiearning` ADD COLUMN `lastRunDate` DATETIME(3) NULL;

-- CreateTable
CREATE TABLE `RoiSettings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `roiPercent` DOUBLE NOT NULL DEFAULT 2,
    `capMultiplier` DOUBLE NOT NULL DEFAULT 2,
    `roiDays` VARCHAR(191) NOT NULL DEFAULT 'Mon,Tue,Wed,Thu,Fri',
    `offDays` VARCHAR(191) NOT NULL DEFAULT 'Sat,Sun',
    `timezone` VARCHAR(191) NOT NULL DEFAULT 'UTC',
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RoiLevelIncome` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `fromUserId` INTEGER NOT NULL,
    `level` INTEGER NOT NULL,
    `amount` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RoiLevelIncome` ADD CONSTRAINT `RoiLevelIncome_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RoiLevelIncome` ADD CONSTRAINT `RoiLevelIncome_fromUserId_fkey` FOREIGN KEY (`fromUserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
