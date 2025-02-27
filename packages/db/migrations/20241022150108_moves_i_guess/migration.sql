/*
  Warnings:

  - You are about to drop the column `closed` on the `Move` table. All the data in the column will be lost.
  - You are about to drop the column `fixing` on the `Move` table. All the data in the column will be lost.
  - You are about to drop the column `fromExternal` on the `Move` table. All the data in the column will be lost.
  - You are about to drop the column `toPatient` on the `Move` table. All the data in the column will be lost.
  - Added the required column `external` to the `Move` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Move" DROP COLUMN "closed",
DROP COLUMN "fixing",
DROP COLUMN "fromExternal",
DROP COLUMN "toPatient",
ADD COLUMN     "external" BOOLEAN NOT NULL;
