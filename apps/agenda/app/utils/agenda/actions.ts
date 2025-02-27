"use server";

import { prisma } from "@repo/db";
import * as Sentry from "@sentry/nextjs";

export async function getEvents(start, end) {
  try {
    const eventsToRename = await prisma.mission.findMany({
      where: {
        startAt: {
          gte: start,
          lte: end,
        },
      },
      select: {
        id: true,
        startAt: true,
        endAt: true,
        name: true,
      },
    });

    return eventsToRename.map((event) => ({
      id: event.id,
      title: event.name,
      start: event.startAt,
      end: event.endAt,
    }));
  } catch (e) {
    Sentry.captureException(e);
    return false;
  }
}
