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
import { prisma } from "@repo/db";
import * as Sentry from "@sentry/nextjs";
import { redirect } from "next/navigation";
import moment from "moment";

type Params = Promise<{ id: string }>;

// Metadata generation that redirects to 404 if the mission is not found

export async function generateMetadata(props: {
  params: Params;
}): Promise<Metadata> {
  const params = await props.params;

  let mission: {
    name: string;
  };

  try {
    mission = await prisma.mission.findFirstOrThrow({
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
    title: mission.name,
  };
}

// ----------------------------

const Mission = async (props: { params: Params }) => {
  const params = await props.params;

  // Fetch the mission or redirect to 404 if it doesn't exist

  let mission: any;

  try {
    mission = await prisma.mission.findUniqueOrThrow({
      where: {
        id: Number(params.id),
      },
    });
  } catch {
    redirect("/errors/404");
  }

  // Fetch the moves of the mission

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
    item: {
      name: string;
      unit: string;
    };
    id: number;
  }[];

  try {
    moves = await prisma.move.findMany({
      where: {
        missionId: mission.id,
      },
      select: {
        id: true,
        user: {
          select: {
            image: true,
            name: true,
          },
        },
        item: {
          select: {
            name: true,
            unit: true,
          },
        },
        number: true,
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
      },
    });
  } catch (error) {
    Sentry.captureException(error);
    redirect("/errors/500");
  }

  // Define mission state

  let state = <span className="badge bg-cyan text-cyan-fg">Annulée</span>;

  switch (mission.state) {
    case 0:
      state = (
        <span className="badge bg-yellow text-yellow-fg">
          Remontée en attente
        </span>
      );
      break;
    case 1:
      state = (
        <span className="badge bg-lime text-azure-fg">Remontée faite</span>
      );
      break;
  }

  // Page data

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

  // DOM rendering

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
                    <th>Consommable</th>
                    <th>Emplacement</th>
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
                            {move.item.name} ({move.item.unit})
                          </span>
                        )}
                        {move.number < 0 && (
                          <span className="text-red d-inline-flex align-items-center lh-1">
                            <strong>{move.number}</strong>&nbsp;
                            {move.item.name} ({move.item.unit})
                          </span>
                        )}
                      </td>
                      <td>
                        <i className={move.location.type.icon + " icon"} />{" "}
                        {move.location.name}
                      </td>
                    </tr>
                  ))}
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
