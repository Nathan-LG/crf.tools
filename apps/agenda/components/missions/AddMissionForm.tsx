"use client";

import { useRouter } from "next/navigation";
import { createRef, Ref, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import revalidate from "@/app/utils/api/actions";
import { IconExclamationCircle } from "@tabler/icons-react";
import clsx from "clsx";
import Select from "react-select";
import { selectStyle } from "@/app/utils/ui/actions";
import IconOption from "../../../stock/components/ui/IconOptions";
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

  const optionsStructure = [
    {
      value: "UL 1/2",
      label: "UL 1/2",
    },
    {
      value: "UL 3/10",
      label: "UL 3/10",
    },
    {
      value: "UL 4",
      label: "UL 4",
    },
    {
      value: "UL 5",
      label: "UL 5",
    },
    {
      value: "UL 6",
      label: "UL 6",
    },
    {
      value: "UL 7",
      label: "UL 7",
    },
    {
      value: "UL 8",
      label: "UL 8",
    },
    {
      value: "UL 9",
      label: "UL 9",
    },
    {
      value: "UL 10",
      label: "UL 10",
    },
    {
      value: "UL 11",
      label: "UL 11",
    },
    {
      value: "UL 12",
      label: "UL 12",
    },
    {
      value: "UL 13",
      label: "UL 13",
    },
    {
      value: "UL 14",
      label: "UL 14",
    },
    {
      value: "UL 15",
      label: "UL 15",
    },
    {
      value: "UL 16",
      label: "UL 16",
    },
    {
      value: "UL 17",
      label: "UL 17",
    },
    {
      value: "UL 18",
      label: "UL 18",
    },
    {
      value: "UL 19",
      label: "UL 19",
    },
    {
      value: "UL 20",
      label: "UL 20",
    },
    {
      value: "DT 75",
      label: "DT 75",
    },
    {
      value: "Extra-DT",
      label: "Extra-DT",
    },
  ];

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
    {
      value: "Formation",
      label: "Formation",
      icon: "ti ti-school",
    },
    {
      value: "Réunion",
      label: "Réunion",
      icon: "ti ti-armchair",
    },
    {
      value: "Animation",
      label: "Animation",
      icon: "ti ti-balloon",
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
          inputRef={inputRef as unknown as Ref<HTMLInputElement>}
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
            <div className="card-header">
              <h3 className="card-title">Nouvelle mission</h3>
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

                <div className="col-xl-8">
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

                <div className="col-xl-4 col-sm-12">
                  <div className="mb-3">
                    <label className="form-label required">
                      Lieu de la mission
                    </label>
                    <input
                      id="location"
                      type="text"
                      className={clsx(
                        "form-control",
                        errors.location && "is-invalid",
                      )}
                      placeholder="Le T7"
                      {...register("location", {
                        required: true,
                        minLength: 3,
                      })}
                    />
                    <div className="invalid-feedback">
                      {errors.location?.type === "required" && (
                        <>La localisation est obligatoire.</>
                      )}
                      {errors.location?.type === "minLength" && (
                        <>La localisation doit faire au moins 3 caractères.</>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-12">
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      name="description"
                      rows={3}
                      placeholder="Une place de PSE pour le 7"
                    ></textarea>
                  </div>
                </div>

                <div className="col-xl-6 col-sm-12">
                  <div className="mb-3">
                    <label className="form-label required">
                      Structure organisatrice
                    </label>
                    <Controller
                      control={control}
                      name="structure"
                      render={({ field }) => (
                        <Select
                          onChange={(val) => field.onChange(val.value)}
                          options={optionsStructure}
                          placeholder="Sélectionner"
                          styles={selectStyle}
                          required
                          value={optionsStructure.find(
                            (c) => c.value === field.value,
                          )}
                        />
                      )}
                    />
                  </div>
                </div>

                <div className="col-xl-6 col-sm-12">
                  <div className="mb-3">
                    <label className="form-label required">
                      Adresse mail du responsable de la mission
                    </label>

                    <Controller
                      control={control}
                      name="createdBy"
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
