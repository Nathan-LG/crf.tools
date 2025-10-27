"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import clsx from "clsx";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { onSubmit } from "@/app/utils/data/actions";
import DeleteModal from "../ui/DeleteModal";

const EditLockModal = ({ formProps }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id: formProps.lock.id,
      name: formProps.lock.name,
      phoneNumber: formProps.lock.phoneNumber,
      nukiId: formProps.lock.nukiId,
      nukiApiKey: formProps.lock.nukiApiKey,
    },
  });

  return (
    <>
      <form
        onSubmit={handleSubmit((data) =>
          onSubmit(
            data,
            setIsLoading,
            null,
            "locks",
            router,
            "PUT",
            "close-modal-edit",
          ),
        )}
      >
        <div className="modal" id="modal-edit">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  &Eacute;diter la serrure {formProps.lock.name}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  id="close-modal-edit"
                ></button>
              </div>
              <div className="modal-body">
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
              <div className="modal-footer">
                <a
                  className="btn btn-danger"
                  data-bs-toggle="modal"
                  data-bs-target={`#modal-delete-${formProps.lock.id}`}
                >
                  <IconTrash className="icon" />
                  Supprimer la serrure
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

      <DeleteModal
        id={formProps.lock.id}
        alert="Cela supprimera définitivement la serrure."
        message="Serrure supprimée avec succès"
        url="/api/locks/"
        redirect="/dashboard/locks"
      />
    </>
  );
};

export default EditLockModal;
