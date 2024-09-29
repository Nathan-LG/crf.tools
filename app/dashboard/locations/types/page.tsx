import type { Metadata } from "next";
import ContentLayout from "@/components/ContentLayout";
import { IconMoodEmpty, IconPlus } from "@tabler/icons-react";
import { prisma } from "@/prisma";
import DeleteModal from "@/components/DeleteModal";
import EditLocationTypeForm from "@/components/EditLocationTypeModal";

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

const LocationsType = async () => {
  const locationsType = await prisma.locationType.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      icon: true,
    },
  });

  if (locationsType.length === 0) {
    return (
      <ContentLayout pageData={pageData}>
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
      <ContentLayout pageData={pageData}>
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
                  {locationsType.map((locationType) => (
                    <tr key={locationType.id}>
                      <td data-label="Type">
                        <i className={locationType.icon}></i>
                      </td>
                      <td data-label="Nom">
                        <div className="d-flex py-1 align-items-center">
                          <div className="flex-fill">
                            <div className="font-weight-medium">
                              {locationType.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td data-label="Description">
                        <div>{locationType.description}</div>
                      </td>
                      <td>
                        <div className="btn-list flex-nowrap">
                          <button
                            className="btn"
                            data-bs-toggle="modal"
                            data-bs-target={"#modal-edit-" + locationType.id}
                          >
                            &Eacute;diter
                          </button>
                          <button
                            type="button"
                            className="btn"
                            data-bs-toggle="modal"
                            data-bs-target={"#modal-delete-" + locationType.id}
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

        {locationsType.map((locationType) => (
          <>
            <EditLocationTypeForm
              id={locationType.id}
              name={locationType.name}
              description={locationType.description}
              icon={locationType.icon}
              createdAt={undefined}
              updatedAt={undefined}
            />

            <DeleteModal
              key={locationType.id}
              id={locationType.id}
              alert="Cela supprimera aussi tous les emplacements de ce type."
              message="Catégorie supprimée avec succès"
              url="/api/locations/types/"
            />
          </>
        ))}
      </ContentLayout>
    );
  }
};
export default LocationsType;
