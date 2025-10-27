"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import clsx from "clsx";
import { onSubmit } from "@/app/utils/data/actions";
import ErrorDismissable from "@/components/ui/ErrorDismissable";

const AddLockForm = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <form
      onSubmit={handleSubmit((data) =>
        onSubmit(data, setIsLoading, setError, "locks", router, "POST", null),
      )}
    >
      <div className="row row-cards">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Nouvelle serrure</h3>
            </div>
            <div className="card-body">
              <div className="row">
                {error && <ErrorDismissable error={error} />}

                <div className="col-xl-6 col-sm-12">
                  <div className="mb-3">
                    <label className="form-label required" htmlFor="name">
                      Localisation
                    </label>
                    <input
                      id="name"
                      type="text"
                      className="form-control"
                      placeholder="Entrée UL Angers"
                      {...register("name", { required: true })}
                    />
                  </div>
                </div>

                <div className="col-xl-6 col-sm-12">
                  <div className="mb-3">
                    <label className="form-label required" htmlFor="nukiId">
                      Identifiant Nuki
                    </label>
                    <input
                      id="nukiId"
                      type="text"
                      className="form-control"
                      placeholder="123456789"
                      {...register("nukiId", { required: true })}
                    />
                  </div>
                </div>

                <div className="col-xl-6 col-sm-12">
                  <div className="mb-3">
                    <label className="form-label" htmlFor="nukiId">
                      Clé API Nuki
                    </label>
                    <div className="row g-2">
                      <div className="col">
                        <input
                          id="nukiId"
                          type="text"
                          className="form-control"
                          placeholder="7511d719ac97189240c7ec46c3fd69ce72187d713e81a21b538df5bd038d051a"
                          {...register("nukiApiKey")}
                        />
                      </div>
                      <div className="col-auto align-self-center">
                        <span
                          className="form-help"
                          data-bs-toggle="popover"
                          data-bs-placement="left"
                          data-bs-content="Par défaut la clé d'API utilisée est celle du compte Nuki president.paris15@croix-rouge.fr."
                          data-bs-html="true"
                        >
                          ?
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-6 col-sm-12">
                  <div className="mb-3">
                    <label className="form-label">Téléphone lié</label>
                    <input
                      type="tel"
                      className={clsx(
                        "form-control",
                        errors.phoneNumber && "is-invalid",
                      )}
                      placeholder="+33601020304"
                      {...register("phoneNumber", {
                        pattern: /^(\+)[0-9]{1,15}$/,
                      })}
                    />
                    <div className="invalid-feedback">
                      {errors.phoneNumber?.type === "pattern" && (
                        <>
                          Le format doit être au format international, sans
                          espaces et sans tirets.
                        </>
                      )}
                    </div>
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

export default AddLockForm;
