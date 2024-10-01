import { prisma } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";

const schema = z.object({
  name: z.string().trim().min(3, {
    message: "Le nom doit faire au moins 3 caractères.",
  }),
  locationTypeId: z.string().min(1),
  description: z.string().trim(),
  id: z.string().min(1),
});
export async function PUT(req: NextRequest) {
  const formData = await req.formData();

  const data = Object.fromEntries(formData);
  const parsed = schema.safeParse(data);

  if (parsed.success) {
    const location = await prisma.location.update({
      where: {
        id: Number(parsed.data.id),
      },
      data: {
        name: parsed.data.name,
        locationTypeId: Number(parsed.data.locationTypeId),
        description: parsed.data.description,
      },
    });

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Location updated successfully",
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
  params: { params: { id: string } },
) {
  try {
    await prisma.location.delete({
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
      message: "Location deleted successfully",
    }),
    {
      status: 200,
    },
  );
}
