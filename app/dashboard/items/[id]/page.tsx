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
import { prisma } from "@/prisma";
import { redirect } from "next/navigation";

type Props = Promise<{ id: string }>;

export async function generateMetadata(props: {
  params: Props;
}): Promise<Metadata> {
  const params = await props.params;

  const item = await prisma.item.findFirst({
    select: {
      name: true,
    },
    where: {
      id: Number(params.id),
    },
  });

  return {
    title: item.name,
  };
}

const Item = async (props: { params: Props }) => {
  let item;

  const params = await props.params;

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
    redirect("/dashboard/404");
  }

  const moves = await prisma.move.findMany({
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

  const locationItems = await prisma.locationItem.findMany({
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

  const currentTotal = locationItems.reduce((acc, item) => {
    return acc + item.count;
  }, 0);

  const locationMandatoryItems = await prisma.locationMandatoryItem.findMany({
    select: {
      locationTypeId: true,
      count: true,
    },
    where: {
      itemId: Number(params.id),
    },
  });

  let locationMandatoryTotal = 0;

  locationMandatoryItems.forEach((item) => {
    locationMandatoryTotal += item.count;
  });

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
