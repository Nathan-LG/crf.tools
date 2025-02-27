import type { Metadata } from "next";
import { prisma } from "@repo/db";
import { auth } from "auth";
import * as Sentry from "@sentry/nextjs";
import { redirect } from "next/navigation";
import { IconConfetti } from "@tabler/icons-react";
import config from "@/config.json";
import ItemsSelection from "@/components/missionUser/ItemsSelection";
import { ItemCategory } from "@repo/db";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

// Metadata generation that redirects to 404 if the mission code does not exist

export async function generateMetadata(props: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const searchParams = await props.searchParams;

  if (!searchParams.code) {
    redirect("/errors/404");
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
    redirect("/errors/404");
  }
}

// ----------------------------

const MissionUser = async (props: { searchParams: SearchParams }) => {
  const session = await auth();
  if (!session) redirect("/auth/signin");

  const searchParams = await props.searchParams;

  // Fetch mission according to the mission code in the URL

  let mission: {
    id: number;
    name: string;
    endAt: Date;
    state: number;
  };

  try {
    mission = await prisma.mission.findFirstOrThrow({
      select: {
        name: true,
        id: true,
        endAt: true,
        state: true,
      },
      where: {
        code: searchParams.code as string,
      },
    });
  } catch {
    redirect("/errors/404");
  }

  // Fetch user name

  let user: {
    name: string;
  };

  try {
    user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        name: true,
      },
    });
  } catch (error) {
    Sentry.captureException(error);
    redirect("/errors/500");
  }

  // Fetch all items

  let items: {
    ItemCategory: {
      id: number;
      name: string;
      icon: string;
    };
    id: number;
    name: string;
    unit: string;
  }[];

  try {
    items = await prisma.item.findMany({
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
  } catch (error) {
    Sentry.captureException(error);
    redirect("/errors/500");
  }

  // Fetch all locations

  let locations: {
    id: number;
    name: string;
    type: {
      icon: string;
    };
  }[];

  try {
    locations = await prisma.location.findMany({
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
  } catch (error) {
    Sentry.captureException(error);
    redirect("/errors/500");
  }

  // Fetch all item categories

  let itemCategories: ItemCategory[];

  try {
    itemCategories = await prisma.itemCategory.findMany();
  } catch (error) {
    Sentry.captureException(error);
    redirect("/errors/500");
  }

  // DOM rendering

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
                {mission.endAt > new Date() && (
                  <div className="alert alert-warning mt-3" role="alert">
                    <div className="d-flex">
                      <div>
                        <h4 className="alert-title">
                          La mission est-elle terminée ?
                        </h4>
                        <div className="text-secondary">
                          Merci de ne remplir ce formulaire qu&apos;une fois que
                          tu es certain que la mission est terminée.
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {mission.state !== 1 && (
              <ItemsSelection
                items={items}
                itemCategories={itemCategories}
                locations={locations}
                missionId={mission.id}
              />
            )}

            {mission.state === 1 && (
              <div className="alert alert-warning mt-3" role="alert">
                <div className="d-flex">
                  <div>
                    <h4 className="alert-title">
                      La mission est déjà cloturée.
                    </h4>
                    <div className="text-secondary">
                      Le matériel a déjà été compté et la mission est terminée.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionUser;
