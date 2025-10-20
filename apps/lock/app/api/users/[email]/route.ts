import { prisma } from "@repo/db";
import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";

const schema = z.object({
  phoneNumber: z.string().trim().optional(),
  groupId: z.string().trim(),
  stringRoles: z.string().trim(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ email: string }> },
) {
  const formData = await req.formData();
  const email = (await params).email;

  const data = Object.fromEntries(formData);
  const parsed = schema.safeParse(data);

  if (parsed.success) {
    await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        phoneNumber: parsed.data.phoneNumber,
        groupId: Number(parsed.data.groupId),
      },
    });

    await prisma.userRole.deleteMany({
      where: {
        userEmail: email,
      },
    });

    await prisma.userRole.createMany({
      data: parsed.data.stringRoles.split(",").map((role) => ({
        userEmail: email,
        roleId: Number(role),
      })),
    });

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
  { params }: { params: Promise<{ email: string }> },
) {
  const email = (await params).email;

  const user = await prisma.user.findUnique({
    select: {
      name: true,
    },
    where: {
      email: email + "@croix-rouge.fr",
    },
  });

  if (user.name === null) {
    await prisma.userRole.deleteMany({
      where: {
        userEmail: email + "@croix-rouge.fr",
      },
    });

    await prisma.user.delete({
      where: {
        email: email + "@croix-rouge.fr",
        name: null,
      },
    });

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
    return new NextResponse(
      JSON.stringify({
        success: false,
        error: { message: "User already found" },
      }),
      { status: 400 },
    );
  }
}
