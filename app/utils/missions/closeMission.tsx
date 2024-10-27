"use server";

import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { redirect } from "next/navigation";

export async function redirectMission() {
  redirect("/thanks");
}

export default async function closeMission(comment, data, missionId) {
  const session = await auth();
  if (!session) redirect("/auth/signin");

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
      },
    });

    const moves = [];

    data.forEach((move) => {
      move.itemCategories.forEach((itemCategory) => {
        itemCategory.items.forEach((item) => {
          if (move.from !== "ext") {
            moves.push({
              userId: user.id,
              external: move.to === "ext",
              locationId: move.from,
              itemId: item.id,
              number: -Number(item.quantity),
              missionId: missionId,
            });
          }

          if (move.to !== "ext") {
            moves.push({
              userId: user.id,
              external: move.from === "ext",
              locationId: move.to,
              itemId: item.id,
              number: Number(item.quantity),
              missionId: missionId,
            });
          }
        });
      });
    });

    await prisma.move.createMany({
      data: moves,
    });

    const changes = [];

    moves.forEach((move) => {
      const change = changes.find(
        (change) =>
          change.locationId === move.locationId &&
          change.itemId === move.itemId,
      );

      if (change) {
        change.number += move.number;
      } else {
        changes.push({
          locationId: move.locationId,
          itemId: move.itemId,
          number: move.number,
        });
      }
    });

    changes.forEach(async (change) => {
      await prisma.locationItem.update({
        where: {
          locationId_itemId: {
            locationId: change.locationId,
            itemId: change.itemId,
          },
        },
        data: {
          count: {
            increment: change.number,
          },
        },
      });
    });

    await prisma.mission.update({
      where: {
        id: missionId,
      },
      data: {
        comment: comment,
        state: 3,
      },
    });

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}
