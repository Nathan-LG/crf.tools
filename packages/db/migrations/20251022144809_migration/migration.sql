-- DropIndex
DROP INDEX "public"."User_phoneNumber_key";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "phoneNumber" DROP NOT NULL;
