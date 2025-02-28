import type { Metadata } from "next";
import ContentLayout from "@/components/ui/ContentLayout";
import { prisma } from "@repo/db";
import { redirect } from "next/navigation";
import clsx from "clsx";

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
      include: {
        createdBy: true,
      },
    });
  } catch {
    redirect("/errors/404");
  }

  // Page data

  const pageData = {
    ariane: [
      { label: "agenda.crf", href: "/dashboard" },
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
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Informations</h3>
        </div>
        <div className="card-body">
          <div className="datagrid">
            <div className="datagrid-item">
              <div className="datagrid-title">Début</div>
              <div className="datagrid-content">
                {mission.startAt.toLocaleString("fr-FR")}
              </div>
            </div>
            <div className="datagrid-item">
              <div className="datagrid-title">Fin</div>
              <div className="datagrid-content">
                {mission.endAt.toLocaleString("fr-FR")}
              </div>
            </div>
            <div className="datagrid-item">
              <div className="datagrid-title">Type</div>
              <div className="datagrid-content">{mission.type}</div>
            </div>
            <div className="datagrid-item">
              <div className="datagrid-title">Structure organisatrice</div>
              <div className="datagrid-content">{mission.structure}</div>
            </div>
            <div className="datagrid-item">
              <div className="datagrid-title">Lieu</div>
              <div className="datagrid-content">{mission.location}</div>
            </div>
            <div className="datagrid-item">
              <div className="datagrid-title">&eacute;tat des inscriptions</div>
              <div className="datagrid-content">
                <span
                  className={clsx(
                    "status",
                    mission.state === -1 && "status-red",
                    mission.state === 0 && "status-blue",
                    mission.state === 1 && "status-green",
                    mission.state >= 2 && "status-cyan",
                  )}
                >
                  {mission.state === -1 && "Annulée"}
                  {mission.state === 0 && "Inscriptions ouvertes"}
                  {mission.state === 1 && "Inscriptions closes"}
                  {mission.state >= 2 && "Terminé"}
                </span>
              </div>
            </div>
            <div className="datagrid-item">
              <div className="datagrid-title">Responsable mission</div>
              <div className="datagrid-content">{mission.createdBy.name}</div>
            </div>
          </div>
          {mission.description != null && (
            <>
              <div className="hr-text">Description</div>
              <p>{mission.description}-</p>
            </>
          )}
        </div>
      </div>
    </ContentLayout>
  );
};
export default Mission;
