import type { Metadata } from "next";
import ContentLayout from "@/components/ui/ContentLayout";
import {
  IconClockPlay,
  IconClockStop,
  IconHash,
  IconHomeQuestion,
  IconInfoCircle,
  IconUserStar,
} from "@tabler/icons-react";
import { prisma } from "@/prisma";
import { redirect } from "next/navigation";
import moment from "moment";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const mission = await prisma.mission.findFirst({
    select: {
      name: true,
    },
    where: {
      id: Number(params.id),
    },
  });

  return {
    title: mission.name,
  };
}

const Mission = async (params: { params: { id: string } }) => {
  let mission;

  try {
    mission = await prisma.mission.findUniqueOrThrow({
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
      { label: "Missions", href: "/dashboard/missions" },
      { label: mission.name, href: `/dashboard/missions/${mission.id}` },
    ],
    title: mission.name,
    button: "",
    buttonIcon: undefined,
    buttonLink: "",
  };

  let state = <span className="badge bg-red">Annulée</span>;

  switch (mission.state) {
    case 0:
      state = (
        <span className="badge bg-yellow text-yellow-fg">Non commencée</span>
      );
      break;
    case 1:
      state = <span className="badge bg-azure text-azure-fg">Commencée</span>;
      break;
    case 2:
      state = <span className="badge bg-purple text-purple-fg">Terminée</span>;
    case 3:
      state = <span className="badge bg-lime text-lime-fg">Cloturée</span>;
      break;
    default:
      state = <span className="badge bg-cyan text-cyan-fg">Annulée</span>;
      break;
  }

  return (
    <ContentLayout subHeaderProps={pageData}>
      <div className="row row-cards">
        {mission.comment && (
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <div className="card-title">Observations</div>
              </div>
              <div className="card-body">
                <p className="text-secondary">{mission.comment}</p>
              </div>
            </div>
          </div>
        )}

        <div className="col-xl-8 col-sm-12">
          <div className="card">
            <div className="card-header border-0">
              <div className="card-title">Mouvements</div>
            </div>
            <div className="position-relative">
              <div id="chart-development-activity" className=""></div>
            </div>
            <div className="card-table table-responsive">
              <table className="table table-vcenter">
                <thead>
                  <tr>
                    <th>Bénévole</th>
                    <th>Quantité</th>
                    <th>Consommable</th>
                    <th>Mouvement</th>
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

        <div className="col-xl-4 col-sm-12">
          <div className="card mb-3">
            <div className="card-header">
              <div className="card-title">Paramètres</div>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <IconHash className="icon" /> {mission.code}
              </div>

              <div className="mb-3">
                <IconInfoCircle className="icon" /> {state}
              </div>

              <div className="mb-3">
                <IconUserStar className="icon" /> {mission.userEmail}
              </div>

              <div className="mb-3">
                <IconHomeQuestion className="icon" /> {mission.type}
              </div>

              <div className="mb-3">
                <IconClockPlay className="icon" />{" "}
                {moment(mission.startAt).format("\\L\\e DD/MM/YYYY à HH:mm")}
              </div>

              <div className="mb-3">
                <IconClockStop className="icon" />{" "}
                {moment(mission.endAt).format("\\L\\e DD/MM/YYYY à HH:mm")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
};
export default Mission;
