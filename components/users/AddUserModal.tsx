"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import revalidate from "@/app/utils/api/actions";
import toast from "@/app/utils/ui/actions";
import clsx from "clsx";
import { IconUserPlus } from "@tabler/icons-react";

const AddUserModal = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  async function onSubmit(data) {
    setIsLoading(true);

    const formData = data;

    try {
      const response = await fetch(`/api/users`, {
        method: "POST",
        body: new URLSearchParams(formData),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const data = await response.json();

      if (!data.success) {
        toast(true, data.error.message);
      } else {
        toast(false, "Bénévole ajouté avec succès");
        document.getElementById("close-modal").click();
        revalidate("/dashboard/users");
        router.push("/dashboard/users");
      }
    } catch (error) {
      toast(true, error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const { register, handleSubmit } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="modal" id="modal-add-user">
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Ajouter un bénévole</h5>
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
                  Adresse mail
                </label>
                <div className="input-group input-group-flat">
                  <input
                    type="text"
                    className="form-control text-end pe-0"
                    placeholder="john.doe"
                    {...register("email", { required: true })}
                  />
                  <span className="input-group-text">@croix-rouge.fr</span>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label required" htmlFor="name">
                  Numéro de téléphone
                </label>
                <div className="input-group input-group-flat">
                  <input
                    type="phone"
                    className="form-control"
                    placeholder="0612345678"
                    {...register("phoneNumber", { required: true })}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <a
                href="#"
                className="btn btn-link link-secondary"
                id="close-modal"
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
                <IconUserPlus className="icon" />
                Ajouter
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddUserModal;
