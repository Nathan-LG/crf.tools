import { prisma } from "@repo/db";
import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";

const schema = z.object({
  name: z.string().trim().min(1, "Le nom est requis"),
  nukiId: z.string().trim().min(1, "Le Nuki ID est requis"),
  nukiApiKey: z.string().trim().optional(),
  phoneNumber: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const data = Object.fromEntries(formData);
  const parsed = schema.safeParse(data);

  if (parsed.success) {
    const lock = await prisma.lock.create({
      data: {
        name: parsed.data.name,
        nukiId: parsed.data.nukiId,
        nukiApiKey: parsed.data.nukiApiKey ? parsed.data.nukiApiKey : null,
        phoneNumber: parsed.data.phoneNumber ? parsed.data.phoneNumber : null,
      },
    });

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Lock added successfully",
        lock,
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
