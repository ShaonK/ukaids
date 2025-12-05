-- AddForeignKey
ALTER TABLE `ApprovedDeposit` ADD CONSTRAINT `ApprovedDeposit_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RejectedDeposit` ADD CONSTRAINT `RejectedDeposit_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
