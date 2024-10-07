import { prisma } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";

const schema = z.object({
  phoneNumber: z.string().trim().min(10, {
    message: "Le numéro de téléphone doit faire au moins 10 caractères.",
  }),
  groupId: z.string().trim().optional(),
});

export async function PUT(
  req: NextRequest,
  params: { params: { id: string } },
) {
  const formData = await req.formData();

  const data = Object.fromEntries(formData);
  const parsed = schema.safeParse(data);

  const tempUser = await prisma.tempUser.count({
    where: {
      id: params.params.id,
    },
  });

  if (parsed.success) {
    if (tempUser === 0) {
      await prisma.user.update({
        where: {
          id: params.params.id,
        },
        data: {
          phoneNumber: parsed.data.phoneNumber,
          groupId: Number(parsed.data.groupId),
        },
      });
    } else {
      await prisma.tempUser.update({
        where: {
          id: params.params.id,
        },
        data: {
          phoneNumber: parsed.data.phoneNumber,
        },
      });
    }

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "User updated successfully",
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
    await prisma.tempUser.delete({
      where: {
        id: params.params.id,
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
      message: "User deleted successfully",
    }),
    {
      status: 200,
    },
  );
}
