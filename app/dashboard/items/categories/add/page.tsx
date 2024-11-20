import type { Metadata } from "next";
import ContentLayout from "@/components/ui/ContentLayout";
import AddItemCategoryForm from "@/components/itemCategory/AddItemCategoryForm";

// Metadata

export const metadata: Metadata = {
  title: "Ajouter une catégorie d'emplacement",
};

// ----------------------------

const AddItemCategory = async () => {
  // Page data

  const pageData = {
    ariane: [
      { label: "stock.crf", href: "/dashboard" },
      { label: "Consommables", href: "/dashboard/items" },
      { label: "Catégories", href: "/dashboard/items/categories" },
      { label: "Ajouter une catégorie", href: "/dashboard/items/types/add" },
    ],
    title: "Ajouter une catégorie de consommables",
    button: "",
    buttonIcon: undefined,
    buttonLink: "",
  };

  // DOM rendering

  return (
    <ContentLayout subHeaderProps={pageData}>
      <AddItemCategoryForm />
    </ContentLayout>
  );
};

export default AddItemCategory;
