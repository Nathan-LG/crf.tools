-- DropForeignKey
ALTER TABLE "Mission" DROP CONSTRAINT "Mission_userEmail_fkey";

-- AlterTable
ALTER TABLE "Mission" ADD COLUMN     "sendSMS" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "userEmail" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Registration" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "comment" TEXT,
    "missionId" INTEGER NOT NULL,
    "state" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Registration_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Mission" ADD CONSTRAINT "Mission_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "GlobalUser"("email") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registration" ADD CONSTRAINT "Registration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registration" ADD CONSTRAINT "Registration_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "Mission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
