import type { Metadata } from "next";
import ContentLayout from "@/components/ui/ContentLayout";
import { prisma } from "@repo/db";
import AddUserForm from "@/components/users/AddUserForm";

// Metadata

export const metadata: Metadata = {
  title: "Ajouter un utilisateur",
};

// ----------------------------

const AddUser = async () => {
  const groups = await prisma.group.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  // Page data

  const pageData = {
    ariane: [
      { label: "lock.crf", href: "/dashboard" },
      { label: "Utilisateurs", href: "/dashboard/users" },
      { label: "Ajouter un utilisateur", href: "/dashboard/users/add" },
    ],
    title: "Ajouter un utilisateur",
    button: "",
    buttonIcon: undefined,
    buttonLink: "",
  };

  // DOM rendering

  return (
    <ContentLayout subHeaderProps={pageData}>
      <AddUserForm groups={groups} />
    </ContentLayout>
  );
};
export default AddUser;
