/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `emailVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Item` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ItemCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Location` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LocationItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LocationMandatoryItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LocationType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Mission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MissionRequirement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Move` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Registration` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserRole` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[phoneNumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phoneNumber` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Item" DROP CONSTRAINT "Item_itemCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Location" DROP CONSTRAINT "Location_locationTypeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."LocationItem" DROP CONSTRAINT "LocationItem_itemId_fkey";

-- DropForeignKey
ALTER TABLE "public"."LocationItem" DROP CONSTRAINT "LocationItem_locationId_fkey";

-- DropForeignKey
ALTER TABLE "public"."LocationMandatoryItem" DROP CONSTRAINT "LocationMandatoryItem_itemId_fkey";

-- DropForeignKey
ALTER TABLE "public"."LocationMandatoryItem" DROP CONSTRAINT "LocationMandatoryItem_locationTypeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Mission" DROP CONSTRAINT "Mission_createdByEmail_fkey";

-- DropForeignKey
ALTER TABLE "public"."MissionRequirement" DROP CONSTRAINT "MissionRequirement_missionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."MissionRequirement" DROP CONSTRAINT "MissionRequirement_roleId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Move" DROP CONSTRAINT "Move_itemId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Move" DROP CONSTRAINT "Move_locationId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Move" DROP CONSTRAINT "Move_missionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Move" DROP CONSTRAINT "Move_userEmail_fkey";

-- DropForeignKey
ALTER TABLE "public"."Registration" DROP CONSTRAINT "Registration_missionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Registration" DROP CONSTRAINT "Registration_roleId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Registration" DROP CONSTRAINT "Registration_userEmail_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserRole" DROP CONSTRAINT "UserRole_roleId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserRole" DROP CONSTRAINT "UserRole_userEmail_fkey";

-- DropIndex
DROP INDEX "public"."User_email_key";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "emailVerified",
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "phoneNumber" SET NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("phoneNumber");

-- DropTable
DROP TABLE "public"."Item";

-- DropTable
DROP TABLE "public"."ItemCategory";

-- DropTable
DROP TABLE "public"."Location";

-- DropTable
DROP TABLE "public"."LocationItem";

-- DropTable
DROP TABLE "public"."LocationMandatoryItem";

-- DropTable
DROP TABLE "public"."LocationType";

-- DropTable
DROP TABLE "public"."Mission";

-- DropTable
DROP TABLE "public"."MissionRequirement";

-- DropTable
DROP TABLE "public"."Move";

-- DropTable
DROP TABLE "public"."Registration";

-- DropTable
DROP TABLE "public"."Role";

-- DropTable
DROP TABLE "public"."UserRole";

-- DropTable
DROP TABLE "public"."VerificationToken";

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");
