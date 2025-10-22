import type { Metadata } from "next";
import ContentLayout from "@/components/ui/ContentLayout";
import { SingleStatCard } from "@/components/ui/SingleStatCard";
import { IconCircleKey, IconLogs, IconUsers } from "@tabler/icons-react";
import { prisma } from "@repo/db";

export const metadata: Metadata = {
  title: "Administration",
};

const pageData = {
  ariane: [{ label: "lock.crf", href: "/dashboard" }],
  title: "Administration",
  button: "",
  buttonIcon: undefined,
  buttonLink: "",
};

const Dashboard = async () => {
  const lockCount = await prisma.lock.count({});
  const userCount = await prisma.user.count({});
  const logsCount = await prisma.log.count({});

  return (
    <ContentLayout subHeaderProps={pageData}>
      <div className="row row-cards">
        <SingleStatCard
          Icon={IconCircleKey}
          color="primary"
          number={lockCount}
          labelSingular="Serrure"
          labelPlural="Serrures"
        />
        <SingleStatCard
          Icon={IconUsers}
          color="green"
          number={userCount}
          labelSingular="Utilisateur"
          labelPlural="Utilisateurs"
        />
        <SingleStatCard
          Icon={IconLogs}
          color="red"
          number={logsCount}
          labelSingular="Enregistrement"
          labelPlural="Enregistrements"
        />
      </div>
    </ContentLayout>
  );
};
export default Dashboard;
