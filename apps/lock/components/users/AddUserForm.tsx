"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import revalidate from "@/app/utils/api/actions";
import { IconExclamationCircle } from "@tabler/icons-react";
import clsx from "clsx";
import Select from "react-select";
import { selectStyle } from "@/app/utils/ui/actions";

const AddUserForm = ({ roles, groups }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  async function onSubmit(data) {
    setIsLoading(true);
    setError(null);

    let stringRoles = "";

    if (data.roles !== undefined) {
      data.roles.map((role) => {
        stringRoles += role.value + ",";
      });

      data.stringRoles = stringRoles.substring(0, stringRoles.length - 1);
    } else {
      data.stringRoles = "";
    }

    const formData = data;

    try {
      const response = await fetch("/api/users", {
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
        revalidate("/dashboard/users");
        router.push("/dashboard/users");
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

  const optionsGroups = groups.map((group) => ({
    value: group.id,
    label: group.name,
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row row-cards">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Nouveau bénévole</h3>
            </div>
            <div className="card-body">
              <div className="row">
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
                </div>

                <div className="col-xl-6 col-sm-12">
                  <div className="mb-3">
                    <label className="form-label">Téléphone</label>
                    <input
                      type="text"
                      className={clsx(
                        "form-control",
                        errors.phoneNumber && "is-invalid",
                      )}
                      placeholder="+33601020304"
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
                </div>

                <div className="col-xl-6 col-sm-12">
                  <div className="mb-3">
                    <label className="form-label required">Groupe</label>
                    <Controller
                      control={control}
                      name="groupId"
                      render={({ field }) => (
                        <Select
                          onChange={(val) => field.onChange(val.value)}
                          options={optionsGroups}
                          placeholder="Sélectionner"
                          styles={selectStyle}
                          value={optionsGroups.find(
                            (c) => c.value === field.value,
                          )}
                        />
                      )}
                    />
                  </div>
                </div>

                <div className="col-xl-6 col-sm-12">
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
                          options={roles}
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

export default AddUserForm;
