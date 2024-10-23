import type { Metadata } from "next";
import { prisma } from "@/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { IconConfetti } from "@tabler/icons-react";
import config from "@/config.json";
import ItemsSelection from "@/components/missionUser/ItemsSelection";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  if (!searchParams.code) {
    return {
      title: "Erreur",
    };
  }

  try {
    const mission = await prisma.mission.findFirstOrThrow({
      select: {
        name: true,
      },
      where: {
        code: searchParams.code as string,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      title: mission.name,
    };
  } catch {
    return {
      title: "Erreur",
    };
  }
}

const MissionUser = async ({ params, searchParams }: Props) => {
  try {
    const session = await auth();
    if (!session) redirect("/auth/signin");

    const mission = await prisma.mission.findFirstOrThrow({
      select: {
        name: true,
        endAt: true,
      },
      where: {
        code: searchParams.code as string,
      },
    });

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        name: true,
      },
    });

    const items = await prisma.item.findMany({
      select: {
        id: true,
        name: true,
        unit: true,
        ItemCategory: {
          select: {
            id: true,
            name: true,
            icon: true,
          },
        },
      },
    });

    const locations = await prisma.location.findMany({
      select: {
        id: true,
        name: true,
        type: {
          select: {
            icon: true,
          },
        },
      },
    });
    const itemCategories = await prisma.itemCategory.findMany();

    return (
      <div className="page">
        <div className="page-wrapper">
          <div className="page-header d-print-none">
            <div className="container-xl">
              <div className="row g-2 align-items-center">
                <div className="col">
                  <div className="page-pretitle">
                    stock.crf - {config.instance}
                  </div>
                  <h2 className="page-title">{mission.name}</h2>
                </div>
              </div>

              <div className="row mt-2 align-items-center">
                <div className="col">
                  Hey, {user.name} ! Merci de ton investissement pour tenir les
                  stocks à jour. <IconConfetti className="icon" />
                  {mission.endAt < new Date() && (
                    <div className="alert alert-warning mt-3" role="alert">
                      <div className="d-flex">
                        <div>
                          <h4 className="alert-title">
                            La mission est-elle terminée ?
                          </h4>
                          <div className="text-secondary">
                            Merci de ne remplir ce formulaire qu'une fois que tu
                            es certain que la mission est terminée.
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <ItemsSelection
                items={items}
                itemCategories={itemCategories}
                locations={locations}
              />
            </div>
          </div>
        </div>
      </div>
    );
  } catch {}
};

export default MissionUser;
