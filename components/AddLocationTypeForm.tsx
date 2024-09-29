"use client";

import { IconExclamationCircle } from "@tabler/icons-react";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import revalidate from "@/app/utils/api/actions";

const AddLocationTypeForm = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  async function onSubmit(data) {
    setIsLoading(true);
    setError(null);

    const formData = data;

    try {
      const response = await fetch("/api/locations/types", {
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
        revalidate("/dashboard/locations/types");
        router.push("/dashboard/locations/types");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
                    <label className="form-label required" htmlFor="name">
                      Nom
                    </label>
                    <input
                      id="name"
                      type="text"
                      className={clsx(
                        "form-control",
                        errors.name && "is-invalid",
                      )}
                      placeholder="Lot A"
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
                    <label className="form-label required">Icône</label>
                    <input
                      type="text"
                      className={clsx(
                        "form-control",
                        errors.icon && "is-invalid",
                      )}
                      placeholder="ti ti-letter-a"
                      {...register("icon", { required: true })}
                    />
                    <div className="invalid-feedback">
                      {errors.icon?.type === "required" && (
                        <>L&apos;icône est obligatoire.</>
                      )}
                    </div>
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
                      rows={3}
                      placeholder="Lot utilisé pour armer un poste de secours."
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

export default AddLocationTypeForm;
