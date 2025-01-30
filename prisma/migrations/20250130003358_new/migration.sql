/*
  Warnings:

  - Made the column `budget` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `budget` DECIMAL(10, 2) NOT NULL DEFAULT 0;
