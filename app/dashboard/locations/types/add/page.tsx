import type { Metadata } from "next";
import ContentLayout from "@/components/ContentLayout";

export const metadata: Metadata = {
  title: "Ajouter une catégorie d'emplacement",
};

const pageData = {
  ariane: [
    { label: "stock.crf", href: "/dashboard" },
    { label: "Emplacements", href: "/dashboard/locations" },
    { label: "Catégories", href: "/dashboard/locations/types" },
    { label: "Ajouter une catégorie", href: "/dashboard/locations/types/add" },
  ],
  title: "Ajouter une catégorie d'emplacement",
  button: "",
  buttonIcon: undefined,
  buttonLink: "",
};

const AddLocationType = async () => {
  return (
    <ContentLayout pageData={pageData}>
      <form>
        <div className="row row-cards">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <h3 className="card-title">
                    Nouvelle catégorie d&apos;emplacement de stockage
                  </h3>
                  <p className="card-subtitle">
                    Une catégorie représente un type d&apos;emplacement de
                    stockage, comme un local.
                  </p>
                  <div className="col-xl-6 col-sm-12">
                    <div className="mb-3">
                      <label className="form-label required">Nom</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Lot A"
                        name="name"
                        required
                      />
                    </div>
                  </div>

                  <div className="col-xl-6 col-sm-12">
                    <div className="mb-3">
                      <label className="form-label required">Icône</label>
                      <input
                        typeof="text"
                        className="form-control"
                        name="icon"
                        placeholder="IconLetterA"
                      />
                      <small className="form-hint">
                        Les icônes disponibles sont les icônes{" "}
                        <a href="https://tabler.io/icons" target="_blank">
                          Tabler.io
                        </a>
                        .
                      </small>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        name="description"
                        rows={3}
                        placeholder="Lot utilisé pour armer un poste de secours."
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
export default AddLocationType;
