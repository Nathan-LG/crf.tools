import type { Metadata } from "next";
import ContentLayout from "@/components/ui/ContentLayout";
import { prisma } from "@/prisma";
import AddMissionForm from "@/components/mission/AddMissionForm";

export const metadata: Metadata = {
  title: "Ajouter une mission",
};

const pageData = {
  ariane: [
    { label: "stock.crf", href: "/dashboard" },
    { label: "Missions", href: "/dashboard/missions" },
    { label: "Ajouter une mission", href: "/dashboard/missions/add" },
  ],
  title: "Ajouter une mission",
  button: "",
  buttonIcon: undefined,
  buttonLink: "",
};

const AddMission = async () => {
  const users = await prisma.globalUser.findMany({
    select: {
      email: true,
    },
  });

  return (
    <ContentLayout subHeaderProps={pageData}>
      <AddMissionForm users={users} />
    </ContentLayout>
  );
};
export default AddMission;
