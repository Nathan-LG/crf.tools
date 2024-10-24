"use client";

import { useRouter } from "next/navigation";
import { createRef, RefCallback, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import revalidate from "@/app/utils/api/actions";
import { IconExclamationCircle } from "@tabler/icons-react";
import clsx from "clsx";
import Select from "react-select";
import { selectStyle } from "@/app/utils/ui/actions";
import IconOption from "../ui/IconOptions";
import { forwardRef } from "react";
import IMask from "imask";
import { IMaskInput } from "react-imask";

const AddMissionForm = ({ users }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  async function onSubmit(data) {
    setIsLoading(true);
    setError(null);

    const formData = data;

    try {
      const response = await fetch("/api/missions", {
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
        revalidate("/dashboard/missions");
        router.push("/dashboard/missions");
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

  const options = users.map((user) => ({
    value: user.email,
    label: user.email,
  }));

  const optionsType = [
    {
      value: "PAPS / DPS",
      label: "PAPS / DPS",
      icon: "ti ti-building-hospital",
    },
    {
      value: "Réseau de secours",
      label: "Réseau de secours",
      icon: "ti ti-ambulance",
    },
    {
      value: "Logistique",
      label: "Logistique",
      icon: "ti ti-forklift",
    },
  ];

  interface CustomProps {
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
    mask: any;
  }

  const MaskedTextField = forwardRef<IMask.MaskElement, CustomProps>(
    (props, inputRef) => {
      const { onChange, mask, ...other } = props;
      const ref = createRef();

      return (
        <IMaskInput
          {...other}
          placeholder="00/00/0000 00:00"
          inputRef={inputRef as RefCallback<IMask.MaskElement>}
          className={clsx("form-control", errors.startAt && "is-invalid")}
          ref={ref}
          mask={mask}
          // unmask={true}
          onAccept={(value: any) => {
            onChange({ target: { name: other.name, value } });
          }}
        />
      );
    },
  );

  MaskedTextField.displayName = "MaskedTextField";

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row row-cards">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="row">
                <h3 className="card-title">Nouvelle mission</h3>
                <p className="card-subtitle">
                  Chaque mission doit avoir un responsable matériel.
                </p>

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
                    <label className="form-label required">Nom</label>
                    <input
                      id="name"
                      type="text"
                      className={clsx(
                        "form-control",
                        errors.name && "is-invalid",
                      )}
                      placeholder="Journées Brassens - Samedi"
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
                </div>

                <div className="col-xl-6 col-sm-12">
                  <div className="mb-3">
                    <label className="form-label required">
                      Adresse mail du responsbale matériel
                    </label>

                    <Controller
                      control={control}
                      name="userEmail"
                      render={({ field }) => (
                        <Select
                          onChange={(val) => field.onChange(val.value)}
                          options={options}
                          placeholder="Sélectionner"
                          styles={selectStyle}
                          required
                          value={options.find((c) => c.value === field.value)}
                        />
                      )}
                    />
                  </div>
                </div>

                <div className="col-xl-4 col-sm-12">
                  <div className="mb-3">
                    <label className="form-label required">
                      Type de mission
                    </label>
                    <Controller
                      control={control}
                      name="type"
                      render={({ field }) => (
                        <Select
                          onChange={(val) => field.onChange(val.value)}
                          options={optionsType}
                          placeholder="Sélectionner"
                          required
                          styles={selectStyle}
                          value={optionsType.find(
                            (c) => c.value === field.value,
                          )}
                          components={{ Option: IconOption }}
                        />
                      )}
                    />
                  </div>
                </div>

                <div className="col-xl-4 col-sm-12">
                  <div className="mb-3">
                    <label className="form-label required">
                      Début de mission
                    </label>
                    <MaskedTextField
                      mask="00/00/0000 00:00"
                      {...register("startAt", { required: true })}
                    />
                    <div className="invalid-feedback">
                      {errors.startAt?.type === "required" && (
                        <>Le début est obligatoire.</>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-xl-4 col-sm-12">
                  <div className="mb-3">
                    <label className="form-label required">
                      Fin de mission
                    </label>
                    <MaskedTextField
                      mask="00/00/0000 00:00"
                      {...register("endAt", { required: true })}
                    />
                    <div className="invalid-feedback">
                      {errors.endAt?.type === "required" && (
                        <>La fin est obligatoire.</>
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

export default AddMissionForm;
