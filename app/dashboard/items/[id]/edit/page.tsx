import type { Metadata } from "next";
import ContentLayout from "@/components/ui/ContentLayout";
import { prisma } from "@/prisma";
import { redirect } from "next/navigation";
import EditItemQuantities from "@/components/item/EditItemQuantities";
import * as Sentry from "@sentry/nextjs";

type Props = Promise<{ id: string }>;

// Metadata generation that redirects to 404 if the item is not found

export async function generateMetadata(props: {
  params: Props;
}): Promise<Metadata> {
  const params = await props.params;

  let item: {
    name: string;
  };

  try {
    item = await prisma.item.findFirstOrThrow({
      select: {
        name: true,
      },
      where: {
        id: Number(params.id),
      },
    });
  } catch {
    redirect("/errors/404");
  }

  return {
    title: `Éditer les quantités obligatoires de ${item.name}`,
  };
}

// ----------------------------

const EditItem = async (props: { params: Props }) => {
  let item: {
    ItemCategory: { name: string; id: number; icon: string };
    name: string;
    id: number;
    description: string;
    unit: string;
  };

  const params = await props.params;

  // Fetch item or redirect to 404

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
    redirect("/errors/404");
  }

  // Fetch location types and mandatory item counts

  let locationTypes: { name: string; id: number; icon: string }[];
  let locationMandatoryItems: {
    locationTypeId: number;
    itemId: number;
    count: number;
  }[];

  try {
    locationTypes = await prisma.locationType.findMany({
      select: {
        id: true,
        name: true,
        icon: true,
      },
    });
  } catch (error) {
    Sentry.captureException(error);
    redirect("/errors/500");
  }

  try {
    locationMandatoryItems = await prisma.locationMandatoryItem.findMany({
      select: {
        locationTypeId: true,
        itemId: true,
        count: true,
      },
      where: {
        itemId: item.id,
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

  // DOM rendering

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
