import type { Metadata } from "next";
import ContentLayout from "@/components/ui/ContentLayout";
import { prisma } from "@/prisma";
import { Icon12Hours } from "@tabler/icons-react";

export const metadata: Metadata = {
  title: "Ajouter un emplacement",
};

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

const AddLocation = async () => {
  const categories = await prisma.locationType.findMany({
    select: {
      id: true,
      name: true,
      icon: true,
    },
  });

  return (
    <ContentLayout subHeaderProps={pageData}>
      <form>
        <div className="row row-cards">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <h3 className="card-title">Nouvel emplacement de stockage</h3>
                  <p className="card-subtitle">
                    Un emplacement de stockage contient des consommables.
                  </p>
                  <div className="col-xl-6 col-sm-12">
                    <div className="mb-3">
                      <label className="form-label required">Nom</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Stock de l'UL"
                        name="name"
                        required
                      />
                    </div>
                  </div>

                  <div className="col-xl-6 col-sm-12">
                    <div className="mb-3">
                      <label className="form-label required">Catégorie</label>
                      <select
                        typeof="text"
                        className="form-select tomselected ts-hidden-accessible"
                        id="category"
                      >
                        {categories.map((category) => (
                          <option
                            key={category.id}
                            value={category.id}
                            data-custom-properties={<Icon12Hours />}
                          >
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        name="description"
                        rows={3}
                        placeholder="Stock contenu dans la salle à droite de l'accueil. Sous cadenas, code 1337."
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-footer text-end">
                <button type="submit" className="btn btn-primary">
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </ContentLayout>
  );
};
export default AddLocation;
