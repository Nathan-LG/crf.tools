/*
  Warnings:

  - You are about to drop the column `userEmail` on the `Role` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Role" DROP CONSTRAINT "Role_userEmail_fkey";

-- AlterTable
ALTER TABLE "Role" DROP COLUMN "userEmail";
