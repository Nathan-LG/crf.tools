import type { Metadata } from "next";
import ContentLayout from "@/components/ui/ContentLayout";
import { prisma } from "@repo/db";
import AddMissionForm from "@/components/mission/AddMissionForm";
import * as Sentry from "@sentry/nextjs";
import { redirect } from "next/navigation";

// Metadata

export const metadata: Metadata = {
  title: "Ajouter une mission",
};

// ----------------------------

const AddMission = async () => {
  let users: {
    email: string;
  }[];

  try {
    users = await prisma.globalUser.findMany({
      select: {
        email: true,
      },
    });
  } catch (error) {
    Sentry.captureException(error);
    redirect("/errors/500");
  }

  // Page data

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

  // DOM rendering

  return (
    <ContentLayout subHeaderProps={pageData}>
      <AddMissionForm users={users} />
    </ContentLayout>
  );
};
export default AddMission;
