import type { Metadata } from "next";
import ContentLayout from "@/components/ui/ContentLayout";
import AddLockAccessForm from "@/components/locks/AddLockAccessForm";
import { generateMetadataCustom } from "@/app/utils/data/actions";
import { prisma } from "@repo/db";
import { redirect } from "next/navigation";

// Metadata

type Props = Promise<{ id: string; page: null | string }>;

export async function generateMetadata(props: {
  params: Props;
}): Promise<Metadata> {
  return generateMetadataCustom(
    (await props.params).id,
    true,
    prisma.lock,
    "Ajout d'un accès à la serrure ",
  );
}

// ----------------------------

const AddLockAccess = async (props: { params: Props }) => {
  const params = await props.params;

  let lock;

  try {
    lock = await prisma.lock.findUniqueOrThrow({
      select: {
        id: true,
        name: true,
      },
      where: {
        id: Number(params.id),
      },
    });
  } catch {
    redirect("/errors/404");
  }

  const groups = await prisma.group.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      groupId: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  // Page data

  const pageData = {
    ariane: [
      { label: "lock.crf", href: "/dashboard" },
      { label: "Serrures", href: "/dashboard/locks" },
      { label: lock.name, href: `/dashboard/locks/${lock.id}` },
      {
        label: "Gestion des accès",
        href: `/dashboard/locks/${lock.id}/authorizations`,
      },
      {
        label: "Nouveau",
        href: `/dashboard/locks/${lock.id}/authorizations/add`,
      },
    ],
    title: `Gérer les accès de la serrure ${lock.name}`,
    button: "",
    buttonIcon: null,
    buttonLink: "",
  };

  // DOM rendering

  return (
    <ContentLayout subHeaderProps={pageData}>
      <AddLockAccessForm lock={lock} users={users} groups={groups} />
    </ContentLayout>
  );
};
export default AddLockAccess;
