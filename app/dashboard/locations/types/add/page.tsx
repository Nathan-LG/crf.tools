import type { Metadata } from "next";
import ContentLayout from "@/components/ContentLayout";
import AddLocationTypeForm from "./form";

export const metadata: Metadata = {
  title: "Ajouter une catégorie d'emplacement",
};

const pageData = {
  ariane: [
    { label: "stock.crf", href: "/dashboard" },
    { label: "Emplacements", href: "/dashboard/locations" },
    { label: "Catégories", href: "/dashboard/locations/types" },
    { label: "Ajouter une catégorie", href: "/dashboard/locations/types/add" },
  ],
  title: "Ajouter une catégorie d'emplacement",
  button: "",
  buttonIcon: undefined,
  buttonLink: "",
};

const AddLocationType = async () => {
  return (
    <ContentLayout pageData={pageData}>
      <AddLocationTypeForm />
    </ContentLayout>
  );
};
export default AddLocationType;
