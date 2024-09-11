/*
  Warnings:

  - You are about to alter the column `type` on the `products` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.
  - You are about to alter the column `gender` on the `products` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.
  - You are about to alter the column `size` on the `products` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(2))`.
  - You are about to alter the column `condition` on the `products` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(3))`.

*/
-- AlterTable
ALTER TABLE `products` MODIFY `type` ENUM('ropa', 'calzado', 'accesorio', 'otro') NOT NULL,
    MODIFY `gender` ENUM('masculino', 'femenino', 'unisex') NOT NULL,
    MODIFY `size` ENUM('XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'unico') NULL,
    MODIFY `condition` ENUM('nuevo', 'usado') NULL;
