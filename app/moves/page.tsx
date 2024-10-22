import type { Metadata } from "next";
import ContentLayoutSimple from "@/components/ui/ContentLayoutSimple";
import { prisma } from "@/prisma";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  if (!searchParams.id) {
    return {
      title: "Erreur",
    };
  }

  try {
    const mission = await prisma.mission.findFirstOrThrow({
      select: {
        name: true,
      },
      where: {
        code: searchParams.id as string,
      },
    });

    return {
      title: mission.name,
    };
  } catch {
    return {
      title: "Erreur",
    };
  }
}

const Dashboard = ({ params, searchParams }: Props) => (
  <div className="page">
    <div className="page-wrapper">
      <ContentLayoutSimple missionId={searchParams.id as string} />
    </div>
  </div>
);
export default Dashboard;
