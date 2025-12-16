-- DropForeignKey
ALTER TABLE `referralcommissionhistory` DROP FOREIGN KEY `ReferralCommissionHistory_depositId_fkey`;

-- DropForeignKey
ALTER TABLE `roihistory` DROP FOREIGN KEY `RoiHistory_earningId_fkey`;

-- DropIndex
DROP INDEX `ReferralCommissionHistory_depositId_fkey` ON `referralcommissionhistory`;

-- DropIndex
DROP INDEX `RoiHistory_earningId_fkey` ON `roihistory`;

-- AlterTable
ALTER TABLE `referralcommissionhistory` MODIFY `depositId` INTEGER NULL,
    MODIFY `commission` DECIMAL(18, 6) NOT NULL;

-- AlterTable
ALTER TABLE `roihistory` MODIFY `earningId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `RoiHistory` ADD CONSTRAINT `RoiHistory_earningId_fkey` FOREIGN KEY (`earningId`) REFERENCES `roiearning`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReferralCommissionHistory` ADD CONSTRAINT `ReferralCommissionHistory_depositId_fkey` FOREIGN KEY (`depositId`) REFERENCES `Deposit`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
