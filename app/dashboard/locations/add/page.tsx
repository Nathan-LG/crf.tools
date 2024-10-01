import type { Metadata } from "next";
import ContentLayout from "@/components/ui/ContentLayout";
import { prisma } from "@/prisma";
import AddLocationForm from "@/components/location/AddLocationForm";

export const metadata: Metadata = {
  title: "Ajouter un emplacement",
};

const pageData = {
  ariane: [
    { label: "stock.crf", href: "/dashboard" },
    { label: "Emplacements", href: "/dashboard/locations" },
    { label: "Ajouter un emplacement", href: "/dashboard/locations/add" },
  ],
  title: "Ajouter un emplacement",
  button: "",
  buttonIcon: undefined,
  buttonLink: "",
};

const AddLocation = async () => {
  const categories = await prisma.locationType.findMany({
    select: {
      id: true,
      name: true,
      icon: true,
    },
  });

  return (
    <ContentLayout subHeaderProps={pageData}>
      <AddLocationForm locationTypes={categories} />
    </ContentLayout>
  );
};
export default AddLocation;
