-- DropForeignKey
ALTER TABLE "public"."Authorization" DROP CONSTRAINT "Authorization_userId_fkey";

-- AddForeignKey
ALTER TABLE "Authorization" ADD CONSTRAINT "Authorization_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
