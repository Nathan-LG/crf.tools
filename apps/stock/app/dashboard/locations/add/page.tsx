import type { Metadata } from "next";
import ContentLayout from "@/components/ui/ContentLayout";
import { prisma } from "@repo/db";
import AddLocationForm from "@/components/location/AddLocationForm";
import * as Sentry from "@sentry/nextjs";
import { redirect } from "next/navigation";

// Metadata

export const metadata: Metadata = {
  title: "Ajouter un emplacement",
};

// ----------------------------

const AddLocation = async () => {
  // Fetch location types

  let categories: {
    id: number;
    name: string;
    icon: string;
  }[];

  try {
    categories = await prisma.locationType.findMany({
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
      { label: "Emplacements", href: "/dashboard/locations" },
      { label: "Ajouter un emplacement", href: "/dashboard/locations/add" },
    ],
    title: "Ajouter un emplacement",
    button: "",
    buttonIcon: undefined,
    buttonLink: "",
  };

  // DOM rendering

  return (
    <ContentLayout subHeaderProps={pageData}>
      <AddLocationForm locationTypes={categories} />
    </ContentLayout>
  );
};

export default AddLocation;
