import { prisma } from "@/prisma";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";
import sendSMS from "@/app/utils/api/sendSMS";

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

    const user = await prisma.user.findUnique({
      where: {
        email: parsed.data.userEmail,
      },
    });

    const minCeiled = Math.ceil(100_000);
    const maxFloored = Math.floor(999_999);

    const code = Math.floor(
      Math.random() * (maxFloored - minCeiled) + minCeiled,
    ).toString();

    const sids = await sendSMS(startAt, endAt, code, user.phoneNumber);

    const mission = await prisma.mission.create({
      data: {
        name: parsed.data.name,
        userEmail: parsed.data.userEmail,
        type: parsed.data.type,
        startAt: startAt,
        endAt: endAt,
        code: code,
        firstSMS: sids[0],
        secondSMS: sids[1],
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
