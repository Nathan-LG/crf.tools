import sendSMS from "@/app/utils/api/sendSMS";
import { prisma } from "@/prisma";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";
import Twilio from "twilio";

const schema = z.object({
  name: z.string().trim(),
  userEmail: z.string().trim(),
  type: z.string().trim(),
  startAt: z.string().trim(),
  endAt: z.string().trim(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const formData = await req.formData();
  const id = (await params).id;

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

    let mission = await prisma.mission.findUniqueOrThrow({
      where: {
        id: Number(id),
      },
      select: {
        firstSMS: true,
        secondSMS: true,
        code: true,
      },
    });

    const user = await prisma.user.findUnique({
      where: {
        email: parsed.data.userEmail,
      },
    });

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = Twilio(accountSid, authToken);

    try {
      await client.messages(mission.firstSMS).remove();
      await client.messages(mission.secondSMS).remove();

      const sids = await sendSMS(
        startAt,
        endAt,
        mission.code,
        user.phoneNumber,
      );

      mission = await prisma.mission.update({
        where: {
          id: Number(id),
        },
        data: {
          name: parsed.data.name,
          userEmail: parsed.data.userEmail,
          type: parsed.data.type,
          startAt: startAt,
          endAt: endAt,
          firstSMS: sids[0],
          secondSMS: sids[1],
        },
      });
    } catch (error) {
      console.error("Error deleting message :", error);
    }

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
  { params }: { params: Promise<{ id: string }> },
) {
  const id = (await params).id;

  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = Twilio(accountSid, authToken);

    const mission = await prisma.mission.update({
      where: {
        id: Number(id),
      },
      data: {
        state: -1,
      },
    });

    try {
      await client.messages(mission.firstSMS).remove();
      await client.messages(mission.secondSMS).remove();
    } catch (error) {
      console.error("Error deleting message :", error);
    }
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
