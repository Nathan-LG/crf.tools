"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import clsx from "clsx";
import { onSubmit } from "@/app/utils/data/actions";
import ErrorDismissable from "@/components/ui/ErrorDismissable";
import { selectStyle } from "@/app/utils/ui/actions";
import { IconUserPlus } from "@tabler/icons-react";

const AddLockAccessForm = ({ lock, users, groups }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const optionsGroupUsers = groups.map((group) => ({
    label: group.name,
    options: users
      .filter((user) => user.groupId === group.id)
      .map((user) => ({
        value: user.id,
        label: user.name,
      })),
  }));

  const formatGroupLabel = (data) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <span>{data.label}</span>
      <span
        style={{
          backgroundColor: "#EBECF0",
          borderRadius: "2em",
          color: "#172B4D",
          display: "inline-block",
          fontSize: 12,
          fontWeight: "normal",
          lineHeight: "1",
          minWidth: 1,
          padding: "0.16666666666667em 0.5em",
          textAlign: "center",
        }}
      >
        {data.options.length}
      </span>
    </div>
  );

  return (
    <form
      onSubmit={handleSubmit((data) =>
        onSubmit(
          data,
          setIsLoading,
          setError,
          "authorizations",
          router,
          "POST",
          null,
        ),
      )}
    >
      <div className="row row-cards">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                Nouvel accès à la serrure {lock.name}
              </h3>
            </div>
            <div className="card-body">
              <div className="row">
                {error && <ErrorDismissable error={error} />}

                <div className="col-12">
                  <div className="mb-3">
                    <label className="form-label required" htmlFor="userId">
                      Utilisateur
                    </label>
                    <div className="row g-2">
                      <div className="col">
                        <Controller
                          control={control}
                          name="userId"
                          render={({ field }) => (
                            <Select
                              onChange={(val: any) => field.onChange(val.value)}
                              options={optionsGroupUsers}
                              formatGroupLabel={formatGroupLabel}
                              placeholder="Sélectionner"
                              styles={selectStyle}
                            />
                          )}
                        />
                      </div>
                      <div className="col-auto">
                        <a
                          href="#"
                          className="btn btn-2 btn-icon"
                          aria-label="Button"
                        >
                          <IconUserPlus className="icon icon-2" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-6 col-sm-12">
                  <div className="mb-3">
                    <label className="form-label" htmlFor="startAt">
                      Début de l&apos;accès
                    </label>
                    <input
                      id="startAt"
                      type="date"
                      className="form-control"
                      {...register("startAt")}
                    />
                  </div>
                </div>

                <div className="col-xl-6 col-sm-12">
                  <div className="mb-3">
                    <label className="form-label" htmlFor="endAt">
                      Fin de l&apos;accès
                    </label>
                    <input
                      id="endAt"
                      type="date"
                      className="form-control"
                      {...register("endAt")}
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

export default AddLockAccessForm;
