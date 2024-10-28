import type { Metadata } from "next";
import ContentLayout from "@/components/ui/ContentLayout";
import {
  IconClockPlay,
  IconClockStop,
  IconHash,
  IconHomeQuestion,
  IconInfoCircle,
  IconSquareArrowDownFilled,
  IconSquareArrowRightFilled,
  IconSquareArrowUpFilled,
  IconUserStar,
} from "@tabler/icons-react";
import { prisma } from "@/prisma";
import { redirect } from "next/navigation";
import moment from "moment";
import Link from "next/link";

type Params = Promise<{ id: string }>;

export async function generateMetadata(props: {
  params: Params;
}): Promise<Metadata> {
  const params = await props.params;

  const location = await prisma.location.findFirst({
    select: {
      name: true,
    },
    where: {
      id: Number(params.id),
    },
  });

  return {
    title: location.name,
  };
}

const Location = async (props: { params: Params }) => {
  let location;

  const params = await props.params;

  try {
    location = await prisma.location.findUniqueOrThrow({
      where: {
        id: Number(params.id),
      },
    });
  } catch {
    redirect("/dashboard/404");
  }

  const pageData = {
    ariane: [
      { label: "stock.crf", href: "/dashboard" },
      { label: "Emplacements", href: "/dashboard/locations" },
      { label: location.name, href: `/dashboard/locations/${location.id}` },
    ],
    title: location.name,
    button: "",
    buttonIcon: undefined,
    buttonLink: "",
  };

  const locationMandatoryItems = await prisma.locationMandatoryItem.findMany({
    where: {
      locationTypeId: location.typeId,
    },
    select: {
      itemId: true,
      count: true,
    },
  });

  const items = await prisma.item.findMany({
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
    orderBy: {
      itemCategoryId: "asc",
    },
  });

  const locationsItem = await prisma.locationItem.findMany({
    where: {
      locationId: location.id,
    },
    select: {
      itemId: true,
      count: true,
    },
  });

  let lastCategory = -1;

  return (
    <ContentLayout subHeaderProps={pageData}>
      <div className="row row-cards">
        <div className="col-12">
          <div className="card">
            <div className="table-responsive">
              <table className="table card-table table-vcenter text-nowrap datatable">
                <thead>
                  <tr>
                    <th className="w-1">Type</th>
                    <th>Nom</th>
                    <th>Nécessaire</th>
                    <th>Réel</th>
                    <th>Comparatif</th>
                    <th>Unité</th>
                  </tr>
                </thead>
                {items.map((item) => {
                  let header = <></>;

                  if (lastCategory !== item.ItemCategory.id) {
                    header = (
                      <tr>
                        <th colSpan={6}>{item.ItemCategory.name}</th>
                      </tr>
                    );
                  }

                  lastCategory = item.ItemCategory.id;

                  const mandatoryItem = locationMandatoryItems.find(
                    (mandatoryItem) => mandatoryItem.itemId === item.id,
                  );

                  const locationItem = locationsItem.find(
                    (locationItem) => locationItem.itemId === item.id,
                  );

                  let status = (
                    <span className="text-green d-inline-flex align-items-center lh-1">
                      <IconSquareArrowUpFilled className="icon me-1" />{" "}
                      {locationItem.count - mandatoryItem.count}
                    </span>
                  );

                  if (locationItem.count === mandatoryItem.count) {
                    status = (
                      <span className="text-yellow d-inline-flex align-items-center lh-1">
                        <IconSquareArrowRightFilled className="icon me-1" />{" "}
                        {locationItem.count - mandatoryItem.count}
                      </span>
                    );
                  } else if (locationItem.count < mandatoryItem.count) {
                    status = (
                      <span className="text-red d-inline-flex align-items-center lh-1">
                        <IconSquareArrowDownFilled className="icon me-1" />{" "}
                        {locationItem.count - mandatoryItem.count}
                      </span>
                    );
                  }

                  return (
                    <tbody key={item.id}>
                      {header}
                      <tr>
                        <td>
                          <i className={`icon ${item.ItemCategory.icon}`}></i>
                        </td>
                        <td>
                          <Link href={"/dashboard/items/" + item.id}>
                            {item.name}
                          </Link>
                        </td>
                        <td>{mandatoryItem.count}</td>
                        <td>{locationItem.count}</td>
                        <td>{status}</td>
                        <td>{item.unit}</td>
                      </tr>
                    </tbody>
                  );
                })}
              </table>
            </div>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
};
export default Location;
