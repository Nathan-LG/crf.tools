import type { Metadata } from "next";
import ContentLayout from "@/components/ui/ContentLayout";
import {
  IconAmbulance,
  IconBuildingHospital,
  IconFolderQuestion,
  IconForklift,
  IconPlus,
} from "@tabler/icons-react";
import { prisma } from "@/prisma";
import DeleteModal from "@/components/ui/DeleteModal";
import Link from "next/link";
import moment from "moment";
import SearchMissions from "@/components/mission/SearchMission";
import PaginationMissions from "@/components/mission/PaginationMissions";
import EditMissionModal from "@/components/mission/EditMissionModal";

export const metadata: Metadata = {
  title: "Missions",
};

const pageData = {
  ariane: [
    { label: "stock.crf", href: "/dashboard" },
    { label: "Missions", href: "/dashboard/missions" },
  ],
  title: "Liste des missions",
  button: "Ajouter une mission",
  buttonIcon: <IconPlus className="icon" />,
  buttonLink: "/dashboard/missions/add",
};

const Missions = async ({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) => {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;

  const missions = await prisma.mission.findMany({
    select: {
      id: true,
      name: true,
      userEmail: true,
      startAt: true,
      endAt: true,
      state: true,
      type: true,
    },
    orderBy: {
      startAt: "asc",
    },
    where: {
      name: {
        contains: query,
        mode: "insensitive",
      },
    },
    skip: (currentPage - 1) * 20,
    take: 20,
  });

  const globalUsers = await prisma.globalUser.findMany({
    select: {
      email: true,
    },
  });

  return (
    <ContentLayout subHeaderProps={pageData}>
      <div className="col-12">
        <div className="card">
          <div className="card-body border-bottom py-3">
            <div className="d-flex">
              <h1 className="page-title">Toutes les missions</h1>
              <SearchMissions />
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-vcenter table-mobile-md card-table">
              <thead>
                <tr>
                  <th className="w-1">Type</th>
                  <th>Nom</th>
                  <th>Responsable</th>
                  <th>Date de début</th>
                  <th>&Eacute;tat</th>
                  <th className="w-1"></th>
                </tr>
              </thead>
              <tbody>
                {missions.map((mission) => {
                  let icon = <IconFolderQuestion className="icon" />;
                  let state = <span className="badge bg-red">Annulée</span>;

                  switch (mission.type) {
                    case "PAPS / DPS":
                      icon = <IconBuildingHospital className="icon" />;
                      break;
                    case "Réseau de secours":
                      icon = <IconAmbulance className="icon" />;
                      break;
                    case "Logistique":
                      icon = <IconForklift className="icon" />;
                      break;
                    default:
                      icon = <IconFolderQuestion className="icon" />;
                      break;
                  }

                  switch (mission.state) {
                    case 0:
                      state = (
                        <span className="badge bg-yellow text-yellow-fg">
                          Non commencée
                        </span>
                      );
                      break;
                    case 1:
                      state = (
                        <span className="badge bg-azure text-azure-fg">
                          Commencée
                        </span>
                      );
                      break;
                    case 2:
                      state = (
                        <span className="badge bg-purple text-purple-fg">
                          Terminée
                        </span>
                      );
                    case 3:
                      state = (
                        <span className="badge bg-lime text-lime-fg">
                          Cloturée
                        </span>
                      );
                      break;
                    default:
                      state = (
                        <span className="badge bg-cyan text-cyan-fg">
                          Annulée
                        </span>
                      );
                      break;
                  }

                  return (
                    <tr key={mission.id}>
                      <td>{icon}</td>
                      <td data-label="Nom">
                        <div className="d-flex py-1 align-items-center">
                          <div className="flex-fill">
                            <div>
                              <Link href={"/dashboard/missions/" + mission.id}>
                                {mission.name}
                              </Link>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td data-label="Responsable">
                        <div>
                          {mission.userEmail.replace("@croix-rouge.fr", "")}
                        </div>
                      </td>
                      <td data-label="Date">
                        {moment(mission.startAt).format(
                          "\\L\\e DD/MM/YYYY à HH:mm",
                        )}
                      </td>
                      <td>{state}</td>
                      <td>
                        <div className="btn-list flex-nowrap">
                          <button
                            className="btn"
                            data-bs-toggle="modal"
                            data-bs-target={"#modal-edit-" + mission.id}
                          >
                            &Eacute;diter
                          </button>
                          <button
                            type="button"
                            className="btn"
                            data-bs-toggle="modal"
                            data-bs-target={"#modal-delete-" + mission.id}
                          >
                            Annuler
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <PaginationMissions totalPages={missions.length / 20} />
        </div>
      </div>

      {missions.map((mission) => (
        <>
          <EditMissionModal
            key={mission.id}
            mission={mission}
            globalUsers={globalUsers}
          />

          <DeleteModal
            key={mission.id}
            id={mission.id}
            alert="Cela annulera définitivement la mission."
            message="Mission annulée avec succès"
            url="/api/missions/"
            button="Annuler la mission"
          />
        </>
      ))}
    </ContentLayout>
  );
};
export default Missions;
