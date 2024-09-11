/*
  Warnings:

  - You are about to drop the column `productId` on the `rentals` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `rentals` DROP FOREIGN KEY `Rentals_productId_fkey`;

-- AlterTable
ALTER TABLE `rentals` DROP COLUMN `productId`;

-- CreateTable
CREATE TABLE `ProductsOnRentals` (
    `productId` INTEGER NOT NULL,
    `rentalId` INTEGER NOT NULL,

    PRIMARY KEY (`productId`, `rentalId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProductsOnRentals` ADD CONSTRAINT `ProductsOnRentals_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductsOnRentals` ADD CONSTRAINT `ProductsOnRentals_rentalId_fkey` FOREIGN KEY (`rentalId`) REFERENCES `Rentals`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
