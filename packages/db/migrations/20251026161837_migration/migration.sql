-- DropForeignKey
ALTER TABLE "public"."Log" DROP CONSTRAINT "Log_authorizationId_fkey";

-- AlterTable
ALTER TABLE "Log" ALTER COLUMN "authorizationId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_authorizationId_fkey" FOREIGN KEY ("authorizationId") REFERENCES "Authorization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
