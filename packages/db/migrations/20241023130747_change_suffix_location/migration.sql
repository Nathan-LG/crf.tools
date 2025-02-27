/*
  Warnings:

  - You are about to drop the column `suffix` on the `LocationMandatoryItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "suffix" TEXT;

-- AlterTable
ALTER TABLE "LocationMandatoryItem" DROP COLUMN "suffix";
