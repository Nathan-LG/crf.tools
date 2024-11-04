import { prisma } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const formData = await req.formData();
  const id = (await params).id;

  const data = Object.fromEntries(formData);

  const locationTypes = await prisma.locationType.findMany({
    select: {
      id: true,
    },
  });

  for (const locationType of locationTypes) {
    await prisma.locationMandatoryItem.update({
      where: {
        locationTypeId_itemId: {
          locationTypeId: locationType.id,
          itemId: Number(id),
        },
      },
      data: {
        count: Number(data["locationTypeNumber" + locationType.id]),
      },
    });
  }

  return new NextResponse(
    JSON.stringify({
      success: true,
      message: "Item updated successfully",
    }),
    {
      status: 201,
    },
  );
}
