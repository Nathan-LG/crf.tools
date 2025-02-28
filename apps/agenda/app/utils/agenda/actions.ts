"use server";

import { prisma } from "@repo/db";
import * as Sentry from "@sentry/nextjs";

export async function getEvents(userEmail, start, end) {
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
        state: true,
        location: true,
        Registration: {
          select: {
            state: true,
          },
          where: {
            userEmail: userEmail,
          },
        },
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
        typeRaw: className,
        type: event.type,
        classNames: ["dotEvent", className],
        location: event.location,
        state: event.state,
        registration: event.Registration[0]?.state,
      };
    });
  } catch (e) {
    Sentry.captureException(e);
    return false;
  }
}
