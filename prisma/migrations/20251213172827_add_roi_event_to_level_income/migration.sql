-- AlterTable
ALTER TABLE `roilevelincome` ADD COLUMN `roiHistoryId` INTEGER NULL,
    ADD COLUMN `source` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `RoiLevelIncome` ADD CONSTRAINT `RoiLevelIncome_roiHistoryId_fkey` FOREIGN KEY (`roiHistoryId`) REFERENCES `RoiHistory`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
