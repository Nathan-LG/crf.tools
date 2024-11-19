import type { Metadata } from "next";
import ContentLayout from "@/components/ui/ContentLayout";
import { IconMoodEmpty, IconPlus } from "@tabler/icons-react";
import { prisma } from "@/prisma";
import EditLocationModal from "@/components/location/EditLocationModal";
import DeleteModal from "@/components/ui/DeleteModal";
import Link from "next/link";

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

const Locations = async () => {
  const locations = await prisma.location.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      type: {
        select: {
          id: true,
          icon: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  const locationTypes = await prisma.locationType.findMany();

  if (locations.length === 0) {
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
                  {locations.map((location) => (
                    <tr key={location.id}>
                      <td data-label="Type">
                        <i className={location.type.icon + " icon"}></i>
                      </td>
                      <td data-label="Nom">
                        <div className="d-flex py-1 align-items-center">
                          <div className="flex-fill">
                            <div className="font-weight-medium">
                              <Link
                                href={"/dashboard/locations/" + location.id}
                              >
                                {location.name}
                              </Link>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td data-label="Description">
                        <div>{location.description}</div>
                      </td>
                      <td>
                        <div className="btn-list flex-nowrap">
                          <button
                            className="btn"
                            data-bs-toggle="modal"
                            data-bs-target={"#modal-edit-" + location.id}
                          >
                            &Eacute;diter
                          </button>
                          <button
                            type="button"
                            className="btn"
                            data-bs-toggle="modal"
                            data-bs-target={"#modal-delete-" + location.id}
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

        {locations.map((location) => (
          <div key={location.id}>
            <EditLocationModal
              formProps={{
                location: {
                  ...location,
                  createdAt: undefined,
                  updatedAt: undefined,
                  locationTypeId: location.type.id,
                },

                locationTypes,
              }}
            />

            <DeleteModal
              id={location.id}
              alert="Cela supprimera définitivement l'emplacement."
              message="Emplacement supprimé avec succès"
              url="/api/locations/"
            />
          </div>
        ))}
      </ContentLayout>
    );
  }
};
export default Locations;
