-- DropForeignKey
ALTER TABLE `balancetransfer` DROP FOREIGN KEY `BalanceTransfer_packageId_fkey`;

-- DropIndex
DROP INDEX `BalanceTransfer_packageId_fkey` ON `balancetransfer`;

-- AlterTable
ALTER TABLE `balancetransfer` MODIFY `packageId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `BalanceTransfer` ADD CONSTRAINT `BalanceTransfer_packageId_fkey` FOREIGN KEY (`packageId`) REFERENCES `Package`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
