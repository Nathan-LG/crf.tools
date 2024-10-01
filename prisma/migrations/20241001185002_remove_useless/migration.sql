/*
  Warnings:

  - You are about to drop the column `lotA` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `lotB` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `lotC` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `vpsp` on the `Item` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Item" DROP COLUMN "lotA",
DROP COLUMN "lotB",
DROP COLUMN "lotC",
DROP COLUMN "vpsp";
