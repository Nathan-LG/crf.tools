import { prisma } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";

const schema = z.object({
  name: z.string().trim().min(3, {
    message: "Le nom doit faire au moins 3 caractères.",
  }),
  itemCategoryId: z.string().trim().min(1),
  description: z.string().trim(),
  unit: z.string().trim().min(3),
});

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const data = Object.fromEntries(formData);
  const parsed = schema.safeParse(data);

  if (parsed.success) {
    const item = await prisma.item.create({
      data: {
        name: parsed.data.name,
        itemCategoryId: Number(parsed.data.itemCategoryId),
        description: parsed.data.description,
        unit: parsed.data.unit,
      },
    });

    const locationTypes = await prisma.locationType.findMany({
      select: {
        id: true,
      },
    });

    const locationMandatoryItemData = locationTypes.map((locationType) => {
      const countNumber = Number(data["locationTypeNumber" + locationType.id]);

      return {
        locationTypeId: locationType.id,
        itemId: item.id,
        count: countNumber,
      };
    });

    await prisma.locationMandatoryItem.createMany({
      data: locationMandatoryItemData,
    });

    const locations = await prisma.location.findMany({
      select: {
        id: true,
      },
    });

    const locationItemData = locations.map((location) => {
      return {
        locationId: location.id,
        itemId: item.id,
        count: 0,
      };
    });

    await prisma.locationItem.createMany({
      data: locationItemData,
    });

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Item added successfully",
        item,
      }),
      {
        status: 201,
      },
    );
  } else {
    const error: ZodError = parsed.error;
    let errorMessage = "";

    error.errors.map((error) => {
      errorMessage += error.message + "\n";
    });

    return new NextResponse(
      JSON.stringify({
        success: false,
        error: { message: errorMessage },
      }),
      { status: 400 },
    );
  }
}
