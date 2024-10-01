import type { Metadata } from "next";
import ContentLayout from "@/components/ui/ContentLayout";
import { IconMoodEmpty, IconPlus } from "@tabler/icons-react";
import { prisma } from "@/prisma";
import DeleteModal from "@/components/ui/DeleteModal";
import EditItemModal from "@/components/item/EditItemModal";

export const metadata: Metadata = {
  title: "Consommables",
};

const pageData = {
  ariane: [
    { label: "stock.crf", href: "/dashboard" },
    { label: "Consommables", href: "/dashboard/items" },
  ],
  title: "Liste des consommables",
  button: "Ajouter un consommable",
  buttonIcon: <IconPlus className="icon" />,
  buttonLink: "/dashboard/items/add",
};

const Items = async () => {
  const items = await prisma.item.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      ItemCategory: {
        select: {
          id: true,
          name: true,
          icon: true,
        },
      },
    },
    orderBy: {
      itemCategoryId: "asc",
    },
  });

  const categories = await prisma.itemCategory.findMany();

  if (items.length === 0) {
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
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td data-label="Type">
                        <i className={item.ItemCategory.icon + " icon"}></i>
                      </td>
                      <td data-label="Nom">
                        <div className="d-flex py-1 align-items-center">
                          <div className="flex-fill">
                            <div className="font-weight-medium">
                              {item.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td data-label="Description">
                        <div>{item.description}</div>
                      </td>
                      <td>
                        <div className="btn-list flex-nowrap">
                          <button
                            className="btn"
                            data-bs-toggle="modal"
                            data-bs-target={"#modal-edit-" + item.id}
                          >
                            &Eacute;diter
                          </button>
                          <button
                            type="button"
                            className="btn"
                            data-bs-toggle="modal"
                            data-bs-target={"#modal-delete-" + item.id}
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

        {items.map((item) => (
          <>
            <EditItemModal
              formProps={{
                item: {
                  ...item,
                  createdAt: undefined,
                  updatedAt: undefined,
                  itemCategoryId: item.ItemCategory.id,
                },

                categories,
              }}
            />

            <DeleteModal
              key={item.id}
              id={item.id}
              alert="Cela supprimera définitivement le consommable."
              message="Consommable supprimé avec succès"
              url="/api/items/"
            />
          </>
        ))}
      </ContentLayout>
    );
  }
};
export default Items;
