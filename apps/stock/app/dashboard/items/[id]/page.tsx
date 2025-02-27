import type { Metadata } from "next";
import ContentLayout from "@/components/ui/ContentLayout";
import {
  IconBackpack,
  IconBuildingWarehouse,
  IconEdit,
  IconInfoCircle,
  IconSquareArrowDownFilled,
  IconSquareArrowRightFilled,
  IconSquareArrowUpFilled,
} from "@tabler/icons-react";
import { prisma } from "@repo/db";
import * as Sentry from "@sentry/nextjs";
import { redirect } from "next/navigation";

type Props = Promise<{ id: string }>;

// Metadata generation that redirects to 404 if the item is not found

export async function generateMetadata(props: {
  params: Props;
}): Promise<Metadata> {
  const params = await props.params;
  let item: { name: string };

  try {
    item = await prisma.item.findUniqueOrThrow({
      select: {
        name: true,
      },
      where: {
        id: Number(params.id),
      },
    });
  } catch {
    redirect("/errors/404");
  }

  return {
    title: item.name,
  };
}

// ----------------------------

const Item = async (props: { params: Props }) => {
  let item: {
    ItemCategory: { name: string; id: number; icon: string };
    name: string;
    id: number;
    description: string;
    unit: string;
  };

  const params = await props.params;

  // Fetch item or redirect to 404

  try {
    item = await prisma.item.findUniqueOrThrow({
      select: {
        id: true,
        name: true,
        description: true,
        unit: true,
        ItemCategory: {
          select: {
            id: true,
            name: true,
            icon: true,
          },
        },
      },
      where: {
        id: Number(params.id),
      },
    });
  } catch {
    redirect("/errors/404");
  }

  // Fetch moves or throw error to Sentry

  let moves: {
    number: number;
    user: {
      name: string;
      image: string;
    };
    location: {
      name: string;
      type: {
        icon: string;
      };
    };
    id: number;
    createdAt: Date;
  }[];

  try {
    moves = await prisma.move.findMany({
      select: {
        id: true,
        number: true,
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        location: {
          select: {
            name: true,
            type: {
              select: {
                icon: true,
              },
            },
          },
        },
        createdAt: true,
      },
      where: {
        itemId: Number(params.id),
        external: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    Sentry.captureException(error);
    redirect("/errors/500");
  }

  // Fetch location items to count total and mandatory total

  let locationItems: {
    location: {
      name: string;
      id: number;
      type: {
        id: number;
        icon: string;
      };
    };
    count: number;
  }[];
  let locationMandatoryItems: {
    locationTypeId: number;
    count: number;
  }[];

  try {
    locationItems = await prisma.locationItem.findMany({
      select: {
        count: true,
        location: {
          select: {
            id: true,
            name: true,
            type: {
              select: {
                id: true,
                icon: true,
              },
            },
          },
        },
      },
      where: {
        itemId: Number(params.id),
      },
    });
  } catch (error) {
    Sentry.captureException(error);
    redirect("/errors/500");
  }

  const currentTotal = locationItems.reduce((acc, item) => {
    return acc + item.count;
  }, 0);

  try {
    locationMandatoryItems = await prisma.locationMandatoryItem.findMany({
      select: {
        locationTypeId: true,
        count: true,
      },
      where: {
        itemId: Number(params.id),
      },
    });
  } catch (error) {
    Sentry.captureException(error);
    redirect("/errors/500");
  }

  let locationMandatoryTotal = 0;

  locationItems.forEach((item) => {
    locationMandatoryItems.forEach((mandatoryItem) => {
      if (item.location.type.id === mandatoryItem.locationTypeId) {
        locationMandatoryTotal += mandatoryItem.count;
      }
    });
  });

  // Page data

  const pageData = {
    ariane: [
      { label: "stock.crf", href: "/dashboard" },
      { label: "Consommables", href: "/dashboard/items" },
      { label: item.name, href: `/dashboard/items/${item.id}` },
    ],
    title: item.name,
    button: "Éditer les quantités obligatoires",
    buttonIcon: <IconEdit className="icon" />,
    buttonLink: `/dashboard/items/${item.id}/edit`,
  };

  // DOM rendering

  return (
    <ContentLayout subHeaderProps={pageData}>
      <div className="row row-cards">
        <div className="col-12">
          {item.description && (
            <div className="card">
              <div className="card-body">
                <p className="text-secondary">
                  <IconInfoCircle className="icon" /> {item.description}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="col-xl-6 col-sm-12">
          <div className="card">
            <div className="card-header">
              <div className="card-title">Utilisation</div>
            </div>
            <div className="card-table table-responsive">
              <table className="table table-vcenter">
                <thead>
                  <tr>
                    <th>Bénévole</th>
                    <th>Mouvement</th>
                    <th>Empalcement</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {moves.map((move) => (
                    <tr key={move.id}>
                      <td className="w-1">
                        <span
                          className="avatar avatar-sm"
                          style={{
                            backgroundImage: `url(${move.user.image})`,
                          }}
                          data-bs-toggle="tooltip"
                          data-bs-placement="bottom"
                          title={move.user.name}
                        />
                      </td>
                      <td>
                        {move.number > 0 && (
                          <span className="text-green d-inline-flex align-items-center lh-1">
                            <strong>+{move.number}</strong>&nbsp;
                            {item.name} ({item.unit})
                          </span>
                        )}
                        {move.number < 0 && (
                          <span className="text-red d-inline-flex align-items-center lh-1">
                            <strong>{move.number}</strong>&nbsp;
                            {item.name} ({item.unit})
                          </span>
                        )}
                      </td>
                      <td>
                        <i className={move.location.type.icon + " icon"} />{" "}
                        {move.location.name}
                      </td>
                      <td>
                        {new Date(move.createdAt).toLocaleDateString("fr-FR", {
                          year: "numeric",
                          month: "numeric",
                          day: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-xl-6 col-sm-12">
          <div className="row row-cards">
            <div className="col-6">
              <div className="card card-sm mb-3">
                <div className="card">
                  <div className="card-stamp">
                    <div className="card-stamp-icon bg-blue">
                      <IconBuildingWarehouse className="icon" />
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div className="subheader">En stock</div>
                    </div>
                    <div className="h1">
                      {currentTotal} {item.unit + (currentTotal > 1 ? "s" : "")}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-6">
              <div className="card card-sm mb-3">
                <div className="card">
                  <div className="card-stamp">
                    <div className="card-stamp-icon bg-blue">
                      <IconBackpack className="icon" />
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div className="subheader">Stock minimal obligatoire</div>
                    </div>
                    <div className="h1">
                      {locationMandatoryTotal}{" "}
                      {item.unit + (locationMandatoryTotal > 1 ? "s" : "")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  &Eacute;tat des emplacements{" "}
                  <span className="card-subtitle">par {item.unit}</span>
                </h3>
              </div>
              <div className="card-table table-responsive">
                <table className="table table-vcenter">
                  <thead>
                    <tr>
                      <th>Emplacement</th>
                      <th>Nécessaire</th>
                      <th>Réel</th>
                      <th>Comparatif</th>
                    </tr>
                  </thead>
                  <tbody>
                    {locationItems.map((locationItem) => {
                      const mandatory = locationMandatoryItems.find(
                        (locationMandatoryItem) =>
                          locationMandatoryItem.locationTypeId ===
                          locationItem.location.type.id,
                      ).count;

                      let status = (
                        <span className="text-green d-inline-flex align-items-center lh-1">
                          <IconSquareArrowUpFilled className="icon me-1" />{" "}
                          {locationItem.count - mandatory}
                        </span>
                      );

                      if (locationItem.count === mandatory) {
                        status = (
                          <span className="text-yellow d-inline-flex align-items-center lh-1">
                            <IconSquareArrowRightFilled className="icon me-1" />{" "}
                            {locationItem.count - mandatory}
                          </span>
                        );
                      } else if (locationItem.count < mandatory) {
                        status = (
                          <span className="text-red d-inline-flex align-items-center lh-1">
                            <IconSquareArrowDownFilled className="icon me-1" />{" "}
                            {locationItem.count - mandatory}
                          </span>
                        );
                      }

                      return (
                        <tr key={locationItem.location.id}>
                          <td>
                            <i
                              className={
                                "icon me-2 " + locationItem.location.type.icon
                              }
                            />{" "}
                            {locationItem.location.name}
                          </td>
                          <td>{mandatory}</td>
                          <td>{locationItem.count}</td>
                          <td>{status}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
};

export default Item;
