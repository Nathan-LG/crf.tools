import type { Metadata } from "next";
import ContentLayout from "@/components/ui/ContentLayout";
import AddLocationTypeForm from "@/components/locationType/AddLocationTypeForm";

// Metadata

export const metadata: Metadata = {
  title: "Ajouter une catégorie d'emplacement",
};

// ----------------------------

const AddLocationType = async () => {
  // Page data

  const pageData = {
    ariane: [
      { label: "stock.crf", href: "/dashboard" },
      { label: "Emplacements", href: "/dashboard/locations" },
      { label: "Catégories", href: "/dashboard/locations/types" },
      {
        label: "Ajouter une catégorie",
        href: "/dashboard/locations/types/add",
      },
    ],
    title: "Ajouter une catégorie d'emplacement",
    button: "",
    buttonIcon: undefined,
    buttonLink: "",
  };

  return (
    <ContentLayout subHeaderProps={pageData}>
      <AddLocationTypeForm />
    </ContentLayout>
  );
};

export default AddLocationType;
