-- AlterTable
ALTER TABLE `withdrawrequest` ADD COLUMN `approvedAt` DATETIME(3) NULL,
    ADD COLUMN `commission` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `netAmount` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `rejectedAt` DATETIME(3) NULL;
