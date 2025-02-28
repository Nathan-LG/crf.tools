import type { Metadata } from "next";
import ContentLayout from "@/components/ui/ContentLayout";
import { prisma } from "@repo/db";
import AddUserForm from "@/components/user/AddUserForm";
import * as Sentry from "@sentry/nextjs";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

// Metadata

export const metadata: Metadata = {
  title: "Ajouter un bénévole",
};

// ----------------------------

const AddUser = async () => {
  const session = await auth();
  if (!session) redirect("/auth/signin");

  let roles: {
    id: number;
    title: string;
  }[];

  let groups: {
    id: number;
    name: string;
  }[];

  try {
    roles = await prisma.role.findMany({
      select: {
        id: true,
        title: true,
      },
    });
  } catch (error) {
    Sentry.captureException(error);
    redirect("/errors/500");
  }

  try {
    groups = await prisma.group.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  } catch (error) {
    Sentry.captureException(error);
    redirect("/errors/500");
  }

  const trueRoles = roles.map((role) => {
    return {
      value: role.id,
      label: role.title,
    };
  });

  // Page data

  const pageData = {
    ariane: [
      { label: "agenda.crf", href: "/dashboard" },
      { label: "Bénévoles", href: "/dashboard/users" },
      { label: "Ajouter un bénévole", href: "/dashboard/users/add" },
    ],
    title: "Ajouter un bénévole",
    button: "",
    buttonIcon: undefined,
    buttonLink: "",
  };

  // DOM rendering

  return (
    <ContentLayout subHeaderProps={pageData}>
      <AddUserForm roles={trueRoles} groups={groups} />
    </ContentLayout>
  );
};
export default AddUser;
