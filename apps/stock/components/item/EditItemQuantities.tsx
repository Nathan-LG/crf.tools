"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import revalidate from "@/app/utils/api/actions";
import { IconExclamationCircle } from "@tabler/icons-react";
import clsx from "clsx";

const AddItemForm = ({ locationMandatoryItems, locationTypes, item }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  async function onSubmit(data) {
    setIsLoading(true);
    setError(null);

    const formData = data;

    try {
      const response = await fetch(`/api/items/${item.id}/quantities`, {
        method: "PUT",
        body: new URLSearchParams(formData),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error.message);
      } else {
        revalidate("/dashboard/items");
        router.push("/dashboard/items");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const { register, handleSubmit } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row row-cards">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="row">
                <h3 className="card-title">
                  Quantités minimales obligatoires de {item.name}
                </h3>
                <p className="card-subtitle">
                  Si nécessaire, il est possible de noter ici le nombre
                  obligatoire de ce nouveau consommable dans chaque type
                  d&apos;emplacement.
                </p>

                {error && (
                  <div
                    className="alert alert-danger alert-dismissible"
                    role="alert"
                  >
                    <div className="d-flex">
                      <div>
                        <IconExclamationCircle className="alert-icon" />
                      </div>
                      <div>{error}</div>
                    </div>
                    <a
                      className="btn-close"
                      data-bs-dismiss="alert"
                      aria-label="close"
                    ></a>
                  </div>
                )}

                {locationTypes.map((locationType) => (
                  <div
                    className="mb-3 col-xl-3 col-sm-12"
                    key={locationType.id}
                  >
                    <label className="form-label">{locationType.name}</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className={locationType.icon + " icon"} />
                      </span>
                      <input
                        type="number"
                        className="form-control"
                        defaultValue={
                          locationMandatoryItems.find(
                            (locationMandatoryItem) =>
                              locationMandatoryItem.locationTypeId ===
                              locationType.id,
                          )?.count
                        }
                        {...register("locationTypeNumber" + locationType.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card-footer text-end">
              <button
                type="submit"
                className={clsx("btn btn-primary", isLoading && "btn-loading")}
                disabled={isLoading}
              >
                Modifier
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddItemForm;
