import type { Metadata } from "next";
import ContentLayout from "@/components/ui/ContentLayout";
import {
  IconBackpack,
  IconBuildingWarehouse,
  IconInfoCircle,
  IconLetterA,
  IconSquareArrowUpFilled,
} from "@tabler/icons-react";
import { prisma } from "@/prisma";
import { redirect } from "next/navigation";
import AreaChart from "@/components/ui/AreaChart";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
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

const Item = async (params: { params: { id: string } }) => {
  let item;

  try {
    item = await prisma.item.findUniqueOrThrow({
      select: {
        id: true,
        name: true,
        description: true,
        ItemCategory: {
          select: {
            id: true,
            name: true,
            icon: true,
          },
        },
      },
      where: {
        id: Number(params.params.id),
      },
    });
  } catch {
    redirect("/dashboard/404");
  }

  const pageData = {
    ariane: [
      { label: "stock.crf", href: "/dashboard" },
      { label: "Consommables", href: "/dashboard/items" },
      { label: item.name, href: `/dashboard/items/${item.id}` },
    ],
    title: item.name,
    button: "",
    buttonIcon: undefined,
    buttonLink: "",
  };

  const options = {
    chart: {
      type: "area",
      fontFamily: "inherit",
      height: 192,
      sparkline: {
        enabled: true,
      },
      animations: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: true,
    },
    fill: {
      opacity: 0.16,
      type: "solid",
    },
    stroke: {
      width: 2,
      lineCap: "round",
      curve: "smooth",
    },
    tooltip: {
      theme: "dark",
    },
    grid: {
      strokeDashArray: 4,
    },
    colors: ["#206bc4"],
    legend: {
      show: false,
    },
    point: {
      show: false,
    },
    xaxis: {
      categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
      labels: {
        padding: 0,
      },
      tooltip: {
        enabled: false,
      },
      axisBorder: {
        show: false,
      },
    },
  };

  const series = [
    {
      name: "series-1",
      data: [30, 40, 35, 50, 49, 60, 70, 91, 125],
    },
  ];

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
            <div className="card-header border-0">
              <div className="card-title">Utilisation</div>
            </div>
            <div className="position-relative">
              <div id="chart-development-activity" className="">
                <AreaChart options={options} series={series} height={200} />
              </div>
            </div>
            <div className="card-table table-responsive">
              <table className="table table-vcenter">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Commit</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="w-1">
                      <span className="avatar avatar-sm"></span>
                    </td>
                    <td className="td-truncate">
                      <div className="text-truncate">
                        Fix dart Sass compatibility (#29755)
                      </div>
                    </td>
                    <td className="text-nowrap text-secondary">28 Nov 2019</td>
                  </tr>
                  <tr>
                    <td className="w-1">
                      <span className="avatar avatar-sm">JL</span>
                    </td>
                    <td className="td-truncate">
                      <div className="text-truncate">
                        Change deprecated html tags to text decoration classes
                        (#29604)
                      </div>
                    </td>
                    <td className="text-nowrap text-secondary">27 Nov 2019</td>
                  </tr>
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
                      <div className="subheader">Paires en stock</div>
                    </div>
                    <div className="h1">14</div>
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
                      <div className="subheader">Paires nécessaires</div>
                    </div>
                    <div className="h1">14</div>
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
                  <span className="card-subtitle">par paires</span>
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
                    <tr>
                      <td>
                        <IconLetterA className="icon me-2" /> Lot A1
                      </td>
                      <input
                        type="text"
                        className="form-control form-control-flush"
                        placeholder="xx"
                        style={{ width: "75px" }}
                      />
                      <td>
                        <input
                          type="text"
                          className="form-control form-control-flush"
                          style={{ width: "75px" }}
                          placeholder="xx"
                        />
                      </td>
                      <td>
                        <span className="text-green d-inline-flex align-items-center lh-1">
                          <IconSquareArrowUpFilled className="icon me-1" /> 7
                        </span>
                      </td>
                    </tr>
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
