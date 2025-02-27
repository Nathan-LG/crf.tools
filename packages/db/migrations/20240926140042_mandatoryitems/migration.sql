-- CreateTable
CREATE TABLE "LocationMandatoryItem" (
    "locationTypeId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "LocationMandatoryItem_pkey" PRIMARY KEY ("locationTypeId","itemId")
);

-- AddForeignKey
ALTER TABLE "LocationMandatoryItem" ADD CONSTRAINT "LocationMandatoryItem_locationTypeId_fkey" FOREIGN KEY ("locationTypeId") REFERENCES "LocationType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationMandatoryItem" ADD CONSTRAINT "LocationMandatoryItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
