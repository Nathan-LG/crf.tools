import { prisma } from "@repo/db";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";

const schema = z.object({
  name: z.string().trim().min(3, {
    message: "Le nom doit faire au moins 3 caractères.",
  }),
  type: z.string().trim().min(1),
  startAt: z.string().trim().min(1),
  endAt: z.string().trim().min(1),
  location: z.string().trim().min(1),
  structure: z.string().trim().min(1),
  createdBy: z.string().email(),
  description: z.string().optional(),
});

export async function POST(req: NextRequest) {
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

    const startAt = new Date(
      moment(parsed.data.startAt, "DD/MM/YYYY hh:mm").format(),
    );

    const endAt = new Date(
      moment(parsed.data.endAt, "DD/MM/YYYY hh:mm").format(),
    );

    const minCeiled = Math.ceil(100_000);
    const maxFloored = Math.floor(999_999);

    const code = Math.floor(
      Math.random() * (maxFloored - minCeiled) + minCeiled,
    ).toString();

    const user = await prisma.user.findUnique({
      where: {
        email: parsed.data.createdBy,
      },
    });

    const mission = await prisma.mission.create({
      data: {
        name: parsed.data.name,
        type: parsed.data.type,
        startAt: startAt,
        endAt: endAt,
        code: code,
        structure: parsed.data.structure,
        location: parsed.data.location,
        createdByEmail: user.email,
        description: parsed.data.description,
      },
    });

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Mission added successfully",
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
