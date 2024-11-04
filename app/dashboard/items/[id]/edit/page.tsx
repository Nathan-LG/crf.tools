import type { Metadata } from "next";
import ContentLayout from "@/components/ui/ContentLayout";
import { prisma } from "@/prisma";
import { redirect } from "next/navigation";
import EditItemQuantities from "@/components/item/EditItemQuantities";

type Props = Promise<{ id: string }>;

export async function generateMetadata(props: {
  params: Props;
}): Promise<Metadata> {
  const params = await props.params;

  const item = await prisma.item.findFirst({
    select: {
      name: true,
    },
    where: {
      id: Number(params.id),
    },
  });

  return {
    title: `Éditer les quantités obligatoires de ${item.name}`,
  };
}

const EditItem = async (props: { params: Props }) => {
  let item;

  const params = await props.params;

  try {
    item = await prisma.item.findUniqueOrThrow({
      select: {
        id: true,
        name: true,
        description: true,
        unit: true,
        ItemCategory: {
          select: {
            id: true,
            name: true,
            icon: true,
          },
        },
      },
      where: {
        id: Number(params.id),
      },
    });
  } catch {
    redirect("/dashboard/404");
  }

  const pageData = {
    ariane: [
      { label: "stock.crf", href: "/dashboard" },
      { label: "Consommables", href: "/dashboard/items" },
      { label: item.name, href: `/dashboard/items/${item.id}` },
      {
        label: "Éditer les quantités obligatoires",
        href: `/dashboard/items/${item.id}/edit`,
      },
    ],
    title: "Éditer les quantités obligatoires",
    button: "",
    buttonIcon: undefined,
    buttonLink: "",
  };

  const locationTypes = await prisma.locationType.findMany({
    select: {
      id: true,
      name: true,
      icon: true,
    },
  });

  const locationMandatoryItems = await prisma.locationMandatoryItem.findMany({
    select: {
      locationTypeId: true,
      itemId: true,
      count: true,
    },
    where: {
      itemId: item.id,
    },
  });

  return (
    <ContentLayout subHeaderProps={pageData}>
      <EditItemQuantities
        item={item}
        locationTypes={locationTypes}
        locationMandatoryItems={locationMandatoryItems}
      />
    </ContentLayout>
  );
};

export default EditItem;
