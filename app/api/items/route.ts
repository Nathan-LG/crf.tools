import { prisma } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";

const schema = z.object({
  name: z.string().trim().min(3, {
    message: "Le nom doit faire au moins 3 caractères.",
  }),
  itemCategoryId: z.string().trim().min(1),
  description: z.string().trim(),
  unit: z.string().trim().min(1),
});

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const data = Object.fromEntries(formData);
  const parsed = schema.safeParse(data);

  if (parsed.success) {
    const location = await prisma.item.create({
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
      return {
        locationTypeId: locationType.id,
        itemId: location.id,
        count: parsed.data["locationTypeNumber" + location.id],
      };
    });

    await prisma.locationMandatoryItem.createMany({
      data: locationMandatoryItemData,
    });

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Item added successfully",
        location,
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
