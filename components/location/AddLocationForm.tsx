"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import revalidate from "@/app/utils/api/actions";
import { IconExclamationCircle } from "@tabler/icons-react";
import clsx from "clsx";
import Select from "react-select";
import { selectStyle } from "@/app/utils/ui/actions";
import IconOption from "@/components/ui/IconOptions";

const AddLocationForm = ({ locationTypes }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  async function onSubmit(data) {
    setIsLoading(true);
    setError(null);

    const formData = data;

    try {
      const response = await fetch("/api/locations", {
        method: "POST",
        body: new URLSearchParams(formData),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error.message);
      } else {
        revalidate("/dashboard/locations");
        router.push("/dashboard/locations");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const options = locationTypes.map((locationType) => ({
    value: locationType.id,
    label: locationType.name,
    icon: locationType.icon,
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row row-cards">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="row">
                <h3 className="card-title">Nouvel emplacement de stockage</h3>
                <p className="card-subtitle">
                  Un emplacement de stockage contient des consommables.
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

                <div className="col-xl-6 col-sm-12">
                  <div className="mb-3">
                    <label className="form-label required">Nom</label>
                    <input
                      id="name"
                      type="text"
                      className={clsx(
                        "form-control",
                        errors.name && "is-invalid",
                      )}
                      placeholder="Stock de l'UL"
                      {...register("name", { required: true, minLength: 3 })}
                    />
                    <div className="invalid-feedback">
                      {errors.name?.type === "required" && (
                        <>Le nom est obligatoire.</>
                      )}
                      {errors.name?.type === "minLength" && (
                        <>Le nom doit faire au moins 3 caractères.</>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-xl-6 col-sm-12">
                  <div className="mb-3">
                    <label className="form-label required">Catégorie</label>

                    <Controller
                      control={control}
                      name="locationType"
                      render={({ field }) => (
                        <Select
                          onChange={(val) => field.onChange(val.value)}
                          options={options}
                          placeholder="Sélectionner"
                          styles={selectStyle as any}
                          value={options.find((c) => c.value === field.value)}
                          components={{ Option: IconOption }}
                        />
                      )}
                    />
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
                      {...register("description")}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-footer text-end">
              <button
                type="submit"
                className={clsx("btn btn-primary", isLoading && "btn-loading")}
                disabled={isLoading}
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddLocationForm;
