"use server";

import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { redirect } from "next/navigation";

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
              number: -item.quantity,
              missionId: missionId,
            });
          }

          if (move.to !== "ext") {
            moves.push({
              userId: user.id,
              external: move.from === "ext",
              locationId: move.to,
              itemId: item.id,
              number: item.quantity,
              missionId: missionId,
            });
          }
        });
      });
    });

    await prisma.move.createMany({
      data: moves,
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

    redirect("/thanks");
  } catch {
    return false;
  }
}
