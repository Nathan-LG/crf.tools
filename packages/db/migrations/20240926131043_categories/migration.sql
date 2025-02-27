/*
  Warnings:

  - You are about to drop the column `icon` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `icon` on the `Location` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Item" DROP COLUMN "icon",
ADD COLUMN     "itemCategoryId" INTEGER;

-- AlterTable
ALTER TABLE "Location" DROP COLUMN "icon";

-- AlterTable
ALTER TABLE "LocationType" ADD COLUMN     "icon" TEXT;

-- CreateTable
CREATE TABLE "ItemCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ItemCategory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_itemCategoryId_fkey" FOREIGN KEY ("itemCategoryId") REFERENCES "ItemCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
