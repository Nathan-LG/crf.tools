import { prisma } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";

const schema = z.object({
  email: z.string().trim().min(3, {
    message: "L'email doit faire au moins 3 caractères.",
  }),
  phoneNumber: z.string().trim().min(10, {
    message: "Le numéro de téléphone doit faire au moins 10 caractères.",
  }),
});

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const data = Object.fromEntries(formData);
  const parsed = schema.safeParse(data);

  if (parsed.success) {
    const user = await prisma.tempUser.create({
      data: {
        email: parsed.data.email + "@croix-rouge.fr",
        phoneNumber: parsed.data.phoneNumber,
      },
    });

    await prisma.globalUser.create({
      data: {
        email: parsed.data.email + "@croix-rouge.fr",
        type: "temp",
      },
    });

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
