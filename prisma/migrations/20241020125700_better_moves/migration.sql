/*
  Warnings:

  - Added the required column `fixing` to the `Move` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fromExternal` to the `Move` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itemId` to the `Move` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toPatient` to the `Move` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Move" ADD COLUMN     "fixing" BOOLEAN NOT NULL,
ADD COLUMN     "fromExternal" BOOLEAN NOT NULL,
ADD COLUMN     "itemId" INTEGER NOT NULL,
ADD COLUMN     "toPatient" BOOLEAN NOT NULL;

-- AddForeignKey
ALTER TABLE "Move" ADD CONSTRAINT "Move_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
