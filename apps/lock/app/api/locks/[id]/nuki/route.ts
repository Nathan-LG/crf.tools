import { APIResponse } from "@/app/utils/api/actions";
import { withAuth } from "@/app/utils/api/auth";
import { nukiApiCall } from "@/app/utils/api/nuki";
import { prisma } from "@repo/db";
import { NextRequest } from "next/server";

async function secureGET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const lockId = (await params).id;

  try {
    const lock = await prisma.lock.findUniqueOrThrow({
      select: {
        nukiId: true,
        nukiApiKey: true,
      },
      where: {
        id: Number(lockId),
      },
    });

    const nukiData = await nukiApiCall(
      lock.nukiId,
      null,
      "GET",
      lock.nukiApiKey || undefined,
    );

    if (nukiData?.success) {
      const online = nukiData.success && nukiData.data?.serverState === 0;
      const battery = { level: null, isCharging: null };
      const status = nukiData.success && nukiData.data?.state?.state;

      if (online) {
        battery.level = nukiData.data?.state?.batteryCharge
          ? nukiData.data?.state?.batteryCharge
          : null;
        battery.isCharging =
          nukiData.data?.state?.batteryCharging !== undefined
            ? nukiData.data?.state?.batteryCharging
            : null;
      }

      return APIResponse({ nukiData: { online, battery, status } }, 200);
    } else {
      return APIResponse(
        { error: { message: "Failed to fetch data from Nuki API" } },
        502,
      );
    }
  } catch {
    return APIResponse({ error: { message: "Lock cannot be found" } }, 400);
  }
}

export const GET = withAuth(secureGET);
