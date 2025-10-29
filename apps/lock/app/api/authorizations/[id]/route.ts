import { APIResponse } from "@/app/utils/api/actions";
import { withAuth } from "@/app/utils/api/auth";
import { prisma } from "@repo/db";
import { NextRequest } from "next/server";

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

      return APIResponse(
        { message: "Authorization deleted successfully" },
        200,
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

      return APIResponse(
        {
          message:
            "Authorization has logs associated, it has been revoked instead of deleted",
        },
        200,
      );
    }
  } catch {
    return APIResponse(
      { error: { message: "Authorization cannot be found" } },
      400,
    );
  }
}

export const DELETE = withAuth(secureDELETE);
