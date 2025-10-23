"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import revalidate from "@/app/utils/api/actions";
import { toast } from "@/app/utils/ui/actions";
import clsx from "clsx";
import type { Group, User } from "@repo/db";
import { IconEdit } from "@tabler/icons-react";
import Select from "react-select";
import { selectStyle } from "@/app/utils/ui/actions";

const EditUserModal = ({ formProps }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  async function onSubmit(data) {
    setIsLoading(true);

    console.log(data);

    const formData = Object.fromEntries(
      Object.entries(data)
        .filter(([_, v]) => v !== "")
        .map(([k, v]) => [k, String(v)]),
    );

    console.log(formData);

    try {
      const response = await fetch(`/api/users/${formProps.user.id}`, {
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
        toast(false, "Utilisateur modifié avec succès");
        document
          .getElementById(`close-modal-edit-${formProps.user.id}`)
          .click();
        revalidate("/dashboard/users");
        router.push("/dashboard/users");
      }
    } catch (error) {
      toast(true, error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const options = formProps.groups.map((group) => ({
    value: group.id,
    label: group.name,
  }));

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: formProps.user.name,
      email: formProps.user.email.includes("@fake.mail")
        ? null
        : formProps.user.email,
      phoneNumber: formProps.user.phoneNumber,
      groupId: formProps.user.groupId,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="modal" id={"modal-edit-" + formProps.user.id}>
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                &Eacute;diter l&apos;utilisateur {formProps.user.name}
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
                  Nom complet
                </label>
                <input
                  id="name"
                  type="text"
                  className="form-control"
                  {...register("name", { required: true })}
                />
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="email">
                  Adresse mail
                </label>
                <input
                  id="email"
                  type="email"
                  className={clsx("form-control", errors.email && "is-invalid")}
                  placeholder="john.doe@croix-rouge.fr"
                  {...register("email", {
                    pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                  })}
                />
                <div className="invalid-feedback">
                  {errors.email?.type === "pattern" && (
                    <>Le format doit être une adresse email valide.</>
                  )}
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="phone">
                  Numéro de téléphone
                </label>
                <input
                  id="phone"
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
                      Le format doit être au format international, sans espaces
                      et sans tirets.
                    </>
                  )}
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label required">Groupe</label>
                <Controller
                  control={control}
                  defaultValue={formProps.user.groupId}
                  name="groupId"
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
            <div className="modal-footer">
              <a
                href="#"
                className="btn btn-link link-secondary"
                id={"close-modal-edit-" + formProps.user.id}
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

export default EditUserModal;
