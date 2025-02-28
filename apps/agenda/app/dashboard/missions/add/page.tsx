import type { Metadata } from "next";
import ContentLayout from "@/components/ui/ContentLayout";
import { prisma } from "@repo/db";
import AddMissionForm from "@/components/mission/AddMissionForm";
import * as Sentry from "@sentry/nextjs";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

// Metadata

export const metadata: Metadata = {
  title: "Ajouter une mission",
};

// ----------------------------

const AddMission = async () => {
  const session = await auth();
  if (!session) redirect("/auth/signin");

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
      { label: "agenda.crf", href: "/dashboard" },
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
      <AddMissionForm users={users} me={session.user.email} />
    </ContentLayout>
  );
};
export default AddMission;
