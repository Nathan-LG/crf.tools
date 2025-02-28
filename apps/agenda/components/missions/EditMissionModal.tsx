"use client";

import { useRouter } from "next/navigation";
import { createRef, forwardRef, Ref, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import revalidate from "@/app/utils/api/actions";
import toast from "@/app/utils/ui/actions";
import clsx from "clsx";
import { IconEdit } from "@tabler/icons-react";
import Select from "react-select";
import { selectStyle } from "@/app/utils/ui/actions";
import IconOption from "../../../stock/components/ui/IconOptions";
import { IMaskInput } from "react-imask";
import moment from "moment";

interface EditMissionModalProps {
  mission: {
    startAt: Date;
    endAt: Date;
    id: number;
    name: string;
    userEmail: string;
    type: string;
    state: number;
  };
  globalUsers: { email: string }[];
}

const EditMissionModal = (formProps: EditMissionModalProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  async function onSubmit(data) {
    setIsLoading(true);

    const formData = data;

    try {
      const response = await fetch(`/api/missions/${formProps.mission.id}`, {
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
        toast(false, "Mission modifiée avec succès");
        document
          .getElementById(`close-modal-edit-${formProps.mission.id}`)
          .click();
        revalidate("/dashboard/missions");
        router.push("/dashboard/missions");
      }
    } catch (error) {
      toast(true, error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const options = formProps.globalUsers.map((globalUser) => ({
    value: globalUser.email,
    label: globalUser.email,
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

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: formProps.mission.name,
      type: formProps.mission.type,
      userEmail: formProps.mission.userEmail,
      startAt: moment(formProps.mission.startAt).format("DD/MM/YYYY HH:mm"),
      endAt: moment(formProps.mission.endAt).format("DD/MM/YYYY HH:mm"),
    },
  });

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
      <div className="modal" id={"modal-edit-" + formProps.mission.id}>
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">&Eacute;diter la mission</h5>
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
                  Nom
                </label>
                <input
                  id="name"
                  type="text"
                  className={clsx("form-control", errors.name && "is-invalid")}
                  placeholder="Lot A1"
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

              <div className="mb-3">
                <label className="form-label required">
                  Adresse mail du responsable matériel
                </label>
                <Controller
                  control={control}
                  defaultValue={formProps.mission.userEmail}
                  name="userEmail"
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
                <label className="form-label required">Type de mission</label>
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
                      value={optionsType.find((c) => c.value === field.value)}
                      components={{ Option: IconOption }}
                    />
                  )}
                />
              </div>

              <div className="mb-3">
                <label className="form-label required">Début de mission</label>
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

              <div className="mb-3">
                <label className="form-label required">Fin de mission</label>
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
            <div className="modal-footer">
              <a
                href="#"
                className="btn btn-link link-secondary"
                id={"close-modal-edit-" + formProps.mission.id}
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

export default EditMissionModal;
