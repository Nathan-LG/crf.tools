import type { Metadata } from "next";
import ContentLayout from "@/components/ui/ContentLayout";
import { prisma } from "@/prisma";
import AddItemForm from "@/components/item/AddItemForm";

export const metadata: Metadata = {
  title: "Ajouter un consommable",
};

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

const AddItem = async () => {
  const categories = await prisma.itemCategory.findMany({
    select: {
      id: true,
      name: true,
      icon: true,
    },
  });

  const locationTypes = await prisma.locationType.findMany({
    select: {
      id: true,
      name: true,
      icon: true,
    },
  });

  return (
    <ContentLayout subHeaderProps={pageData}>
      <AddItemForm categories={categories} locationTypes={locationTypes} />
    </ContentLayout>
  );
};
export default AddItem;
