import { prisma } from "@repo/db";
import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";

const schema = z.object({
  email: z.string().trim().min(1),
  name: z.string().trim().min(1),
  groupId: z.string().trim().min(1),
  stringRoles: z.string().trim(),
  phoneNumber: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const data = Object.fromEntries(formData);
  const parsed = schema.safeParse(data);

  if (parsed.success) {
    const user = await prisma.user.create({
      data: {
        email: parsed.data.email + "@croix-rouge.fr",
        group: {
          connect: {
            id: Number(parsed.data.groupId),
          },
        },
        phoneNumber: parsed.data.phoneNumber,
        name: parsed.data.name,
      },
    });

    const roles = parsed.data.stringRoles.split(",");

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "User added successfully",
        user,
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
