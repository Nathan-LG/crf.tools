import type { Metadata } from "next";
import ContentLayout from "@/components/ui/ContentLayout";
import AddLockForm from "@/components/locks/AddLockForm";

// Metadata

export const metadata: Metadata = {
  title: "Ajouter une serrure",
};

// ----------------------------

const AddLock = async () => {
  // Page data

  const pageData = {
    ariane: [
      { label: "lock.crf", href: "/dashboard" },
      { label: "Serrures", href: "/dashboard/locks" },
      { label: "Ajouter une serrure", href: "/dashboard/locks/add" },
    ],
    title: "Ajouter une serrure",
    button: "",
    buttonIcon: undefined,
    buttonLink: "",
  };

  // DOM rendering

  return (
    <ContentLayout subHeaderProps={pageData}>
      <AddLockForm />
    </ContentLayout>
  );
};
export default AddLock;
