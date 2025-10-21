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
