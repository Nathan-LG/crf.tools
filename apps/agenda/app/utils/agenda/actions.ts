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
        type: true,
      },
    });

    return eventsToRename.map((event) => {
      let className = "";

      switch (event.type) {
        case "PAPS / DPS":
          className = "secours";
          break;
        case "Réseau de secours":
          className = "secours";
          break;
        case "Logistique":
          className = "logistique";
          break;
        case "Formation":
          className = "formation";
          break;
        case "Réunion":
          className = "reunion";
          break;
        case "Animation":
          className = "animation";
          break;
        default:
          className = "unknown";
          break;
      }

      return {
        id: event.id,
        title: "",
        name: event.name,
        start: event.startAt,
        end: event.endAt,
        display: "block",
        allDay: true,
        type: className,
        classNames: ["dotEvent", className],
      };
    });
  } catch (e) {
    Sentry.captureException(e);
    return false;
  }
}
