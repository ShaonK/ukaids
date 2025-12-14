-- AlterTable
ALTER TABLE `userpackage` ADD COLUMN `lastRoiAt` DATETIME(3) NULL,
    ADD COLUMN `totalEarned` DOUBLE NOT NULL DEFAULT 0;
