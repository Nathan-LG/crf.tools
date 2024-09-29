import type { Metadata } from "next";
import ContentLayout from "@/components/ui/ContentLayout";
import { IconPlus } from "@tabler/icons-react";

export const metadata: Metadata = {
  title: "Emplacements",
};

const pageData = {
  ariane: [
    { label: "stock.crf", href: "/dashboard" },
    { label: "Emplacements", href: "/dashboard/locations" },
  ],
  title: "Liste des emplacements",
  button: "Ajouter un emplacement",
  buttonIcon: <IconPlus className="icon" />,
  buttonLink: "/dashboard/locations/add",
};

const Locations = () => (
  <ContentLayout subHeaderProps={pageData}></ContentLayout>
);
export default Locations;
