import { prisma } from "@/prisma";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";

const schema = z.object({
  name: z.string().trim(),
  userEmail: z.string().trim(),
  type: z.string().trim(),
  startAt: z.string().trim(),
  endAt: z.string().trim(),
});

export async function PUT(
  req: NextRequest,
  params: { params: { id: string } },
) {
  const formData = await req.formData();

  const data = Object.fromEntries(formData);
  const parsed = schema.safeParse(data);

  if (parsed.success) {
    if (
      new Date(moment(parsed.data.startAt, "DD/MM/YYYY hh:mm").format()) >
      new Date(moment(parsed.data.endAt, "DD/MM/YYYY hh:mm").format())
    ) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: {
            message: "La date de début doit être avant la date de fin",
          },
        }),
        { status: 400 },
      );
    }

    const mission = await prisma.mission.update({
      where: {
        id: Number(params.params.id),
      },
      data: {
        name: parsed.data.name,
        userEmail: parsed.data.userEmail,
        type: parsed.data.type,
        startAt: new Date(
          moment(parsed.data.startAt, "DD/MM/YYYY hh:mm").format(),
        ),
        endAt: new Date(moment(parsed.data.endAt, "DD/MM/YYYY hh:mm").format()),
      },
    });

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Mission updated successfully",
        mission,
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
    await prisma.mission.update({
      where: {
        id: Number(params.params.id),
      },
      data: {
        state: -1,
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
      message: "Mission cancelled successfully",
    }),
    {
      status: 200,
    },
  );
}
