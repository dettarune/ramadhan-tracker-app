/*
  Warnings:

  - You are about to drop the column `category` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the `Daily_Budget` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Daily_Budget` DROP FOREIGN KEY `Daily_Budget_userId_fkey`;

-- AlterTable
ALTER TABLE `transaction` DROP COLUMN `category`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `role` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `Daily_Budget`;

-- CreateTable
CREATE TABLE `Products` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `price` DECIMAL(65, 30) NOT NULL,
    `stock` INTEGER NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `userId` INTEGER NULL,
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Products` ADD CONSTRAINT `Products_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
