"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import revalidate from "@/app/utils/api/actions";
import { IconEdit } from "@tabler/icons-react";
import toast from "@/app/utils/ui/actions";
import { LocationType } from "@prisma/client";

const EditLocationTypeModal = (locationType: LocationType) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  async function onSubmit(data) {
    setIsLoading(true);

    const formData = data;

    try {
      const response = await fetch(`/api/locations/types/${locationType.id}`, {
        method: "PUT",
        body: new URLSearchParams(formData),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const data = await response.json();

      if (!data.success) {
        toast(true, data.error.message);
      } else {
        toast(false, "Catégorie modifiée avec succès");
        document.getElementById(`close-modal-edit-${locationType.id}`).click();
        revalidate("/dashboard/locations/types");
        router.push("/dashboard/locations/types");
      }
    } catch (error) {
      toast(true, error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id: locationType.id,
      name: locationType.name,
      icon: locationType.icon,
      description: locationType.description,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input id="name" type="hidden" {...register("id", { required: true })} />

      <div className="modal" id={"modal-edit-" + locationType.id}>
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                &Eacute;diter la catégorie d&apos;emplacement
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label required" htmlFor="name">
                  Nom
                </label>
                <input
                  id="name"
                  type="text"
                  className={clsx("form-control", errors.name && "is-invalid")}
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
              <div className="mb-3">
                <label className="form-label required">Icône</label>
                <input
                  type="text"
                  className={clsx("form-control", errors.icon && "is-invalid")}
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
            <div className="modal-footer">
              <a
                href="#"
                className="btn btn-link link-secondary"
                id={"close-modal-edit-" + locationType.id}
                data-bs-dismiss="modal"
              >
                Annuler
              </a>
              <button
                type="submit"
                className={clsx(
                  "btn btn-primary ms-auto",
                  isLoading && "btn-loading",
                )}
                disabled={isLoading}
              >
                <IconEdit className="icon" />
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default EditLocationTypeModal;
