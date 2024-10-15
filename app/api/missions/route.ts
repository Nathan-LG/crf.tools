import { prisma } from "@/prisma";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";

const schema = z.object({
  name: z.string().trim().min(3, {
    message: "Le nom doit faire au moins 3 caractères.",
  }),
  userEmail: z.string().trim().min(1),
  type: z.string().trim().min(1),
  startAt: z.string().trim().min(1),
  endAt: z.string().trim().min(1),
});

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const data = Object.fromEntries(formData);
  const parsed = schema.safeParse(data);

  if (parsed.success) {
    const minCeiled = Math.ceil(100_000);
    const maxFloored = Math.floor(999_999);

    const mission = await prisma.mission.create({
      data: {
        name: parsed.data.name,
        userEmail: parsed.data.userEmail,
        type: parsed.data.type,
        startAt: new Date(
          moment(parsed.data.startAt, "DD/MM/YYYY hh:mm").format(),
        ),
        endAt: new Date(moment(parsed.data.endAt, "DD/MM/YYYY hh:mm").format()),
        code: Math.floor(
          Math.random() * (maxFloored - minCeiled) + minCeiled,
        ).toString(),
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
