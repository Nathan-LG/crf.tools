"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import revalidate from "@/app/utils/api/actions";
import toast from "@/app/utils/ui/actions";
import clsx from "clsx";
import { IconTagPlus } from "@tabler/icons-react";
import Select from "react-select";
import { selectStyle } from "@/app/utils/ui/actions";

const AddRoleModal = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  async function onSubmit(data) {
    setIsLoading(true);

    const formData = data;

    try {
      const response = await fetch(`/api/roles`, {
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
        toast(false, "Rôle ajouté avec succès");
        document.getElementById("close-modal").click();
        revalidate("/dashboard/roles");
        router.push("/dashboard/roles");
      }
    } catch (error) {
      toast(true, error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const options = [
    { value: "blue", label: "Bleu" },
    { value: "azure", label: "Azure" },
    { value: "indigo", label: "Indigo" },
    { value: "purple", label: "Violet" },
    { value: "pink", label: "Rose" },
    { value: "red", label: "Rouge" },
    { value: "orange", label: "Orange" },
    { value: "yellow", label: "Jaune" },
    { value: "lime", label: "Lime" },
    { value: "green", label: "Vert" },
    { value: "teal", label: "Vert canard" },
    { value: "cyan", label: "Cyan" },
    { value: "dark", label: "Noir" },
  ];

  const { control, register, handleSubmit } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="modal" id="modal-add-role">
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Ajouter un rôle</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="col-12">
                <div className="mb-3">
                  <label className="form-label required" htmlFor="name">
                    Nom
                  </label>
                  <div className="input-group input-group-flat">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="PSE2"
                      {...register("title", { required: true })}
                    />
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="mb-3">
                  <div className="form-label">Couleur</div>
                  <Controller
                    control={control}
                    name="color"
                    render={({ field }) => (
                      <Select
                        onChange={(val) => field.onChange(val.value)}
                        options={options}
                        placeholder="Sélectionner"
                        styles={selectStyle}
                        value={options.find((c) => c.value === field.value)}
                      />
                    )}
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
                <IconTagPlus className="icon" />
                Ajouter
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddRoleModal;
