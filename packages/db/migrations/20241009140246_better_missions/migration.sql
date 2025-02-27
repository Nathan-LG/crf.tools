/*
  Warnings:

  - Added the required column `endAt` to the `Mission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startAt` to the `Mission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userEmail` to the `Mission` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Mission" DROP CONSTRAINT "Mission_userId_fkey";

-- DropIndex
DROP INDEX "Mission_code_key";

-- AlterTable
ALTER TABLE "Mission" ADD COLUMN     "endAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "state" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "userEmail" TEXT NOT NULL,
ALTER COLUMN "userId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "GlobalUser" (
    "email" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GlobalUser_pkey" PRIMARY KEY ("email")
);

-- CreateIndex
CREATE UNIQUE INDEX "GlobalUser_email_key" ON "GlobalUser"("email");

-- AddForeignKey
ALTER TABLE "Mission" ADD CONSTRAINT "Mission_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "GlobalUser"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mission" ADD CONSTRAINT "Mission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
