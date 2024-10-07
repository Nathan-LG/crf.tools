"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import revalidate from "@/app/utils/api/actions";
import toast from "@/app/utils/ui/actions";
import clsx from "clsx";
import { IconEdit } from "@tabler/icons-react";

const EditTempUserModal = ({ tempUser }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  async function onSubmit(data) {
    setIsLoading(true);

    const formData = data;

    try {
      const response = await fetch(`/api/users/${tempUser.id}`, {
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
        toast(false, "Bénévole modifié avec succès");
        document.getElementById(`close-modal-edit-${tempUser.id}`).click();
        revalidate("/dashboard/users");
        router.push("/dashboard/users");
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
      phoneNumber: tempUser.phoneNumber,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="modal" id={"modal-edit-" + tempUser.id}>
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">&Eacute;diter le bénévole</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label required">Adresse mail</label>
                <input
                  type="mail"
                  className="form-control"
                  disabled
                  value={tempUser.email}
                />
              </div>

              <div className="mb-3">
                <label className="form-label required" htmlFor="phone">
                  Numéro de téléphone
                </label>
                <input
                  id="name"
                  type="phone"
                  className={clsx(
                    "form-control",
                    errors.phoneNumber && "is-invalid",
                  )}
                  placeholder="0612345678"
                  {...register("phoneNumber", {
                    required: true,
                    minLength: 10,
                  })}
                />
                <div className="invalid-feedback">
                  {errors.phoneNumber?.type === "required" && (
                    <>Le numéro de téléphone est obligatoire.</>
                  )}
                  {errors.phoneNumber?.type === "minLength" && (
                    <>
                      Le numéro de téléphone doit faire au moins 10 caractères.
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <a
                href="#"
                className="btn btn-link link-secondary"
                id={"close-modal-edit-" + tempUser.id}
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

export default EditTempUserModal;
