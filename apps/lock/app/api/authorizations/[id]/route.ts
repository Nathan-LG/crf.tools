import { withAuth } from "@/app/utils/api/auth";
import { prisma } from "@repo/db";
import { NextRequest, NextResponse } from "next/server";

async function secureDELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = (await params).id;

  try {
    const logCount = await prisma.log.count({
      where: {
        authorizationId: Number(id),
      },
    });

    if (logCount === 0) {
      await prisma.authorization.delete({
        where: {
          id: Number(id),
        },
      });

      return new NextResponse(
        JSON.stringify({
          success: true,
          message: "Authorization deleted successfully",
        }),
        {
          status: 200,
        },
      );
    } else {
      await prisma.authorization.update({
        where: {
          id: Number(id),
        },
        data: {
          active: false,
        },
      });

      return new NextResponse(
        JSON.stringify({
          success: true,
          message:
            "Authorization has logs associated, it has been revoked instead of deleted",
        }),
        {
          status: 200,
        },
      );
    }
  } catch {
    return new NextResponse(
      JSON.stringify({
        success: false,
        error: { message: "Authorization cannot be found" },
      }),
      { status: 400 },
    );
  }
}

export const DELETE = withAuth(secureDELETE);
