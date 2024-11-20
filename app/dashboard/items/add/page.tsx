import type { Metadata } from "next";
import ContentLayout from "@/components/ui/ContentLayout";
import { prisma } from "@/prisma";
import AddItemForm from "@/components/item/AddItemForm";
import * as Sentry from "@sentry/nextjs";
import { redirect } from "next/navigation";

// Metadata

export const metadata: Metadata = {
  title: "Ajouter un consommable",
};

const AddItem = async () => {
  let categories: { id: number; name: string; icon: string }[],
    locationTypes: { name: string; id: number; icon: string }[];

  try {
    categories = await prisma.itemCategory.findMany({
      select: {
        id: true,
        name: true,
        icon: true,
      },
    });

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

  // Page data

  const pageData = {
    ariane: [
      { label: "stock.crf", href: "/dashboard" },
      { label: "Consommables", href: "/dashboard/items" },
      { label: "Ajouter un consommable", href: "/dashboard/items/add" },
    ],
    title: "Ajouter un consommable",
    button: "",
    buttonIcon: undefined,
    buttonLink: "",
  };

  // DOM rendering

  return (
    <ContentLayout subHeaderProps={pageData}>
      <AddItemForm categories={categories} locationTypes={locationTypes} />
    </ContentLayout>
  );
};

export default AddItem;
