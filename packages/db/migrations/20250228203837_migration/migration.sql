/*
  Warnings:

  - You are about to drop the column `createdById` on the `Mission` table. All the data in the column will be lost.
  - Added the required column `createdByEmail` to the `Mission` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Mission" DROP CONSTRAINT "Mission_createdById_fkey";

-- AlterTable
ALTER TABLE "Mission" DROP COLUMN "createdById",
ADD COLUMN     "createdByEmail" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Mission" ADD CONSTRAINT "Mission_createdByEmail_fkey" FOREIGN KEY ("createdByEmail") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
