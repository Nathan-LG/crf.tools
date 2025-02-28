"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import revalidate from "@/app/utils/api/actions";
import toast from "@/app/utils/ui/actions";
import clsx from "clsx";
import type { Group, User, Role } from "@repo/db";
import { IconEdit } from "@tabler/icons-react";
import Select from "react-select";
import { selectStyle } from "@/app/utils/ui/actions";

type UserFormProps = {
  formProps: {
    user: User;
    groups: Array<Group>;
    roles: Array<Role>;
    userRoles: Array<{ roleId: number }>;
  };
};

const EditUserModal = ({ formProps }: UserFormProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  async function onSubmit(data) {
    setIsLoading(true);

    const formData = data;

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
        toast(false, "Bénévole modifié avec succès");
        document
          .getElementById(
            `close-modal-edit-${formProps.user.email.replace("@croix-rouge.fr", "").replace(".", "")}`,
          )
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

  const optionsRoles = formProps.roles.map((role) => ({
    value: role.id,
    label: role.title,
  }));

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      roles: formProps.userRoles,
      phoneNumber: formProps.user.phoneNumber,
      groupId: formProps.user.groupId,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div
        className="modal"
        id={
          "modal-edit-" +
          formProps.user.email.replace("@croix-rouge.fr", "").replace(".", "")
        }
      >
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
                  value={formProps.user.email}
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
                  placeholder="33601020304"
                  {...register("phoneNumber", {
                    pattern: /^(\+)[0-9]{11}$/,
                  })}
                />
                <div className="invalid-feedback">
                  {errors.phoneNumber?.type === "pattern" && (
                    <>Le format doit être au format international.</>
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

              <div className="mb-3">
                <div className="form-label">Rôles</div>
                <Controller
                  control={control}
                  name="roles"
                  render={({
                    field: { onChange, onBlur, value, name, ref },
                  }) => (
                    <Select
                      onChange={onChange}
                      onBlur={onBlur}
                      options={optionsRoles}
                      isMulti
                      placeholder="Sélectionner"
                      styles={selectStyle}
                      name={name}
                      value={value}
                      ref={ref}
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
