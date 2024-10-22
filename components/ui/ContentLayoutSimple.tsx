import { auth } from "@/auth";
import { prisma } from "@/prisma";
import {
  IconAperture,
  IconChevronRight,
  IconConfetti,
  IconPlus,
} from "@tabler/icons-react";
import { redirect } from "next/navigation";
import config from "@/config.json";

type ContentProps = {
  missionId: string;
};

const ContentLayoutSimple = async ({ missionId }: ContentProps) => {
  try {
    const session = await auth();
    if (!session) redirect("/auth/signin");

    const mission = await prisma.mission.findFirstOrThrow({
      select: {
        name: true,
      },
      where: {
        code: missionId,
      },
    });

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        name: true,
      },
    });

    console.log(mission);

    return (
      <>
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
              </div>
            </div>

            <button className="btn btn-primary w-100 mt-3">
              <IconPlus className="icon" /> Ajouter un mouvement
            </button>

            <div className="row mt-3 align-items-center">
              <div className="col">
                <div className="card">
                  <div className="card-body">
                    <h3 className="card-title">
                      Lot B1 <IconChevronRight className="icon align-top" />{" "}
                      Victime
                    </h3>

                    <div className="hr-text">
                      <span>
                        <IconAperture className="icon" /> Hémorragie
                      </span>
                    </div>

                    <p className="text-secondary">
                      <strong>2x</strong> Pansements
                      <br />
                      <strong>1x</strong> Garrot
                      <br />
                      <strong>1x</strong> CHU
                    </p>

                    <div className="hr-text">
                      <span>
                        <IconAperture className="icon" /> Malaises
                      </span>
                    </div>

                    <p className="text-secondary">
                      <strong>2x</strong> Couvertures de survie
                    </p>
                  </div>
                  <div className="card-footer">
                    This is standard card footer
                  </div>
                </div>
              </div>
            </div>

            <div className="row mt-3 align-items-center">
              <div className="col">
                <div className="card">
                  <div className="card-body">
                    <h3 className="card-title">Card with footer</h3>
                    <p className="text-secondary">
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                      Aperiam deleniti fugit incidunt, iste, itaque minima neque
                      pariatur perferendis sed suscipit velit vitae voluptatem.
                    </p>
                  </div>
                  <div className="card-footer">
                    This is standard card footer
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } catch {
    return (
      <div className="page-body">
        <div className="container-xl">
          <h1>Erreur</h1>
        </div>
      </div>
    );
  }
};

export default ContentLayoutSimple;
