import { prisma } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";

const schema = z.object({
  name: z.string().trim().min(3, {
    message: "Le nom doit faire au moins 3 caractères.",
  }),
  icon: z.string().trim().min(1, { message: "L'icône est obligatoire." }),
  description: z.string().trim(),
});

export async function PUT(
  req: NextRequest,
  params: { params: { id: string } },
) {
  const formData = await req.formData();

  const data = Object.fromEntries(formData);
  const parsed = schema.safeParse(data);

  if (parsed.success) {
    const itemCategory = await prisma.itemCategory.update({
      where: {
        id: Number(params.params.id),
      },
      data: {
        name: parsed.data.name,
        icon: parsed.data.icon,
        description: parsed.data.description,
      },
    });

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "ItemCategory updated successfully",
        itemCategory,
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
  params: { params: { id: string } },
) {
  try {
    await prisma.itemCategory.delete({
      where: {
        id: Number(params.params.id),
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
      message: "ItemCategory deleted successfully",
    }),
    {
      status: 200,
    },
  );
}
