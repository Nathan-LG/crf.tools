import { withAuth } from "@/app/utils/api/auth";
import { prisma } from "@repo/db";
import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";

const schema = z.object({
  nukiId: z.string().trim().min(1, "Le Nuki ID est requis"),
  nukiApiKey: z.string().trim().optional(),
  name: z.string().trim().min(1, "La localisation est requise"),
  phoneNumber: z.string().trim().optional(),
});

async function securePUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const formData = await req.formData();
  const lockId = (await params).id;

  const data = Object.fromEntries(formData);
  const parsed = schema.safeParse(data);

  if (parsed.success) {
    await prisma.lock.update({
      where: {
        id: Number(lockId),
      },
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
        message: "Lock updated successfully",
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

async function secureDELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const lockId = (await params).id;

  try {
    await prisma.lock.delete({
      where: {
        id: Number(lockId),
      },
    });

    await prisma.log.deleteMany({
      where: {
        lockId: Number(lockId),
      },
    });

    await prisma.authorization.deleteMany({
      where: {
        lockId: Number(lockId),
      },
    });

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Lock deleted successfully",
      }),
      {
        status: 200,
      },
    );
  } catch {
    return new NextResponse(
      JSON.stringify({
        success: false,
        error: { message: "Lock cannot be found" },
      }),
      { status: 400 },
    );
  }
}

export const PUT = withAuth(securePUT);
export const DELETE = withAuth(secureDELETE);
