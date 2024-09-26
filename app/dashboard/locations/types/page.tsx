import type { Metadata } from "next";
import ContentLayout from "@/components/ContentLayout";
import { IconPlus } from "@tabler/icons-react";

export const metadata: Metadata = {
  title: "Catégories d'emplacements",
};

const pageData = {
  ariane: [
    { label: "stock.crf", href: "/dashboard" },
    { label: "Emplacements", href: "/dashboard/locations" },
    { label: "Catégories", href: "/dashboard/locations/types" },
  ],
  title: "Liste des catégories d'emplacement",
  button: "Ajouter une catégorie",
  buttonIcon: <IconPlus className="icon" />,
  buttonLink: "/dashboard/locations/types/add",
};

const LocationsType = () => <ContentLayout pageData={pageData}></ContentLayout>;
export default LocationsType;
