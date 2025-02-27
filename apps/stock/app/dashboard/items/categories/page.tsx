import type { Metadata } from "next";
import ContentLayout from "@/components/ui/ContentLayout";
import { IconMoodEmpty, IconPlus } from "@tabler/icons-react";
import { prisma } from "@repo/db";
import DeleteModal from "@/components/ui/DeleteModal";
import EditItemCategoryForm from "@/components/itemCategory/EditItemCategoryModal";
import * as Sentry from "@sentry/nextjs";
import { redirect } from "next/navigation";

// Metadata

export const metadata: Metadata = {
  title: "Catégories de consommables",
};

// ----------------------------

const LocationsType = async () => {
  let itemCategories: {
    id: number;
    name: string;
    description: string;
    icon: string;
  }[];

  try {
    itemCategories = await prisma.itemCategory.findMany({
      select: {
        id: true,
        name: true,
        description: true,
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
      { label: "Catégories", href: "/dashboard/items/categories" },
    ],
    title: "Liste des catégories de consommables",
    button: "Ajouter une catégorie",
    buttonIcon: <IconPlus className="icon" />,
    buttonLink: "/dashboard/items/categories/add",
  };

  if (itemCategories.length === 0) {
    // DOM rendering if there are no item categories

    return (
      <ContentLayout subHeaderProps={pageData}>
        <div className="col-12">
          <div className="card">
            <div className="empty">
              <div className="empty-icon">
                <IconMoodEmpty className="icon" />
              </div>
              <p className="empty-title">C&apos;est vide...</p>
              <p className="empty-subtitle text-secondary">
                Si vous pensez qu&apos;il s&apos;agit d&apos;une erreur,
                signalez-le au plus vite.
              </p>
            </div>
          </div>
        </div>
      </ContentLayout>
    );
  } else {
    // DOM rendering if there are item categories

    return (
      <ContentLayout subHeaderProps={pageData}>
        <div className="col-12">
          <div className="card">
            <div className="table-responsive">
              <table className="table table-vcenter table-mobile-md card-table">
                <thead>
                  <tr>
                    <th className="w-1">Type</th>
                    <th>Nom</th>
                    <th>Description</th>
                    <th className="w-1"></th>
                  </tr>
                </thead>
                <tbody>
                  {itemCategories.map((itemCategory) => (
                    <tr key={itemCategory.id}>
                      <td data-label="Type">
                        <i className={itemCategory.icon + " icon"}></i>
                      </td>
                      <td data-label="Nom">
                        <div className="d-flex py-1 align-items-center">
                          <div className="flex-fill">
                            <div className="font-weight-medium">
                              {itemCategory.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td data-label="Description">
                        <div>{itemCategory.description}</div>
                      </td>
                      <td>
                        <div className="btn-list flex-nowrap">
                          <button
                            className="btn"
                            data-bs-toggle="modal"
                            data-bs-target={"#modal-edit-" + itemCategory.id}
                          >
                            &Eacute;diter
                          </button>
                          <button
                            type="button"
                            className="btn"
                            data-bs-toggle="modal"
                            data-bs-target={"#modal-delete-" + itemCategory.id}
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {itemCategories.map((itemCategory) => (
          <div key={itemCategory.id}>
            <EditItemCategoryForm
              id={itemCategory.id}
              name={itemCategory.name}
              description={itemCategory.description}
              icon={itemCategory.icon}
              createdAt={undefined}
              updatedAt={undefined}
            />

            <DeleteModal
              id={itemCategory.id}
              alert="Cela supprimera aussi tous les consommables de ce type."
              message="Catégorie supprimée avec succès"
              url="/api/items/categories/"
            />
          </div>
        ))}
      </ContentLayout>
    );
  }
};

export default LocationsType;
