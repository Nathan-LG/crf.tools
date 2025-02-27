import { prisma } from "@repo/db";
import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";

const schema = z.object({
  name: z.string().trim().min(3, {
    message: "Le nom doit faire au moins 3 caractères.",
  }),
  itemCategoryId: z.string().min(1),
  description: z.string().trim(),
  unit: z.string().trim().min(3),
});
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const formData = await req.formData();
  const id = (await params).id;

  const data = Object.fromEntries(formData);
  const parsed = schema.safeParse(data);

  if (parsed.success) {
    const category = await prisma.itemCategory.findUnique({
      where: {
        id: Number(parsed.data.itemCategoryId),
      },
    });

    if (category === null || category === undefined) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: { message: "Category not found" },
        }),
        { status: 400 },
      );
    }

    const location = await prisma.item.update({
      where: {
        id: Number(id),
      },
      data: {
        name: parsed.data.name,
        itemCategoryId: Number(parsed.data.itemCategoryId),
        description: parsed.data.description,
        unit: parsed.data.unit,
      },
    });

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Item updated successfully",
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = (await params).id;

  try {
    await prisma.item.delete({
      where: {
        id: Number(id),
      },
    });

    await prisma.locationMandatoryItem.deleteMany({
      where: {
        itemId: Number(id),
      },
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        success: false,
        error: { message: error.message },
      }),
      { status: 400 },
    );
  }
  return new NextResponse(
    JSON.stringify({
      success: true,
      message: "Item deleted successfully",
    }),
    {
      status: 200,
    },
  );
}
