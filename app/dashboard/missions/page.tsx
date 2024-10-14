import type { Metadata } from "next";
import ContentLayout from "@/components/ui/ContentLayout";
import { IconMoodEmpty, IconPlus } from "@tabler/icons-react";
import { prisma } from "@/prisma";
import DeleteModal from "@/components/ui/DeleteModal";
import Link from "next/link";

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

const Missions = async () => {
  const missions = await prisma.mission.findMany({
    select: {
      id: true,
      name: true,
      userEmail: true,
      startAt: true,
      state: true,
    },
  });

  if (missions.length === 0) {
    return (
      <ContentLayout subHeaderProps={pageData}>
        <div className="col-12">
          <div className="card">
            <div className="empty">
              <div className="empty-icon">
                <IconMoodEmpty className="icon" />
              </div>
              <p className="empty-title">C&apos;est vide...</p>
              <p className="empty-subtitle text-secondary">
                Si vous pensez qu&apos;il s&apos;agit d&apos;une erreur,
                signalez-le au plus vite.
              </p>
            </div>
          </div>
        </div>
      </ContentLayout>
    );
  } else {
    return (
      <ContentLayout subHeaderProps={pageData}>
        <div className="col-12">
          <div className="card">
            <div className="table-responsive">
              <table className="table table-vcenter table-mobile-md card-table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Responsable</th>
                    <th>Date</th>
                    <th>&Eacute;tat</th>
                    <th className="w-1"></th>
                  </tr>
                </thead>
                <tbody>
                  {missions.map((mission) => (
                    <tr key={mission.id}>
                      <td data-label="Nom">
                        <div className="d-flex py-1 align-items-center">
                          <div className="flex-fill">
                            <div className="font-weight-medium">
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
                      <td data-label="Date">{mission.startAt.toString()}</td>
                      <td>{mission.state}</td>
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
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {missions.map((location) => (
          <>
            <DeleteModal
              key={location.id}
              id={location.id}
              alert="Cela supprimera définitivement la mission."
              message="Mission supprimée avec succès"
              url="/api/missions/"
            />
          </>
        ))}
      </ContentLayout>
    );
  }
};
export default Missions;
