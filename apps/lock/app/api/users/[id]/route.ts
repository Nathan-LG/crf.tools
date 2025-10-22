import { createRandomString } from "@/app/utils/ts/strings";
import { prisma } from "@repo/db";
import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";

const schema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().email().optional(),
  phoneNumber: z.string().trim().optional(),
  groupId: z.string().trim(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const formData = await req.formData();
  const userId = (await params).id;

  const data = Object.fromEntries(formData);
  const parsed = schema.safeParse(data);

  if (parsed.success) {
    if (parsed.data.email === undefined) {
      parsed.data.email = createRandomString(12) + "@fake.mail";
    }

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        phoneNumber: parsed.data.phoneNumber ? parsed.data.phoneNumber : null,
        groupId: Number(parsed.data.groupId),
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
  const userId = (await params).id;

  try {
    await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "User deleted successfully",
      }),
      {
        status: 200,
      },
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        success: false,
        error: { message: "User cannot be found" },
      }),
      { status: 400 },
    );
  }
}
