"use client";

import {
  IconPlus,
  IconChevronRight,
  IconTrash,
  IconPencil,
  IconDeviceFloppy,
  IconCubePlus,
} from "@tabler/icons-react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import toast, { selectStyle } from "@/app/utils/ui/actions";
import IconOption from "../ui/IconOptions";
import { useState } from "react";
import DeleteMovementModal from "./DeleteMovementModal";

const ItemsSelection = (props) => {
  const [moves, setMoves] = useState([]);

  async function onSubmitAddMovement(data) {
    const formData = data;

    if (formData.from === undefined || formData.to === undefined) {
      toast(true, "Veuillez sélectionner une origine et une destination");
    } else if (formData.from === formData.to) {
      toast(
        true,
        "Veuillez sélectionner une origine et une destination différente",
      );
    } else if (
      moves.find(
        (move) => move.from === formData.from && move.to === formData.to,
      )
    ) {
      toast(true, "Ce mouvement existe déjà.");
    } else {
      setMoves([
        ...moves,
        {
          from: formData.from,
          to: formData.to,
          itemGroups: [],
        },
      ]);

      document.getElementById("close-modal-add-move").click();
    }
  }

  const optionsType = props.locations.map((location) => ({
    value: location.id,
    label: location.name,
    icon: location.type.icon,
  }));

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const idToNameLocation = (id) => {
    const location = props.locations.find((location) => location.id === id);
    return location ? location.name : "Externe";
  };

  const removeLocationMovements = (index) => {
    document.getElementById("close-modal-remove-" + index).click();
    setMoves(moves.filter((move, i) => i !== index));
  };

  return (
    <>
      <button
        className="btn btn-primary w-100 mt-3"
        data-bs-toggle="modal"
        data-bs-target="#modal-add-move"
      >
        <IconPlus className="icon" /> Ajouter un mouvement
      </button>
      {moves.map((move, index) => (
        <div key={index}>
          <div className="row mt-3 align-items-center">
            <div className="col">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">
                    {idToNameLocation(move.from)}{" "}
                    <IconChevronRight className="icon align-top" />{" "}
                    {idToNameLocation(move.to)}
                  </h3>
                  <div className="card-actions btn-actions">
                    <button
                      className="btn-action"
                      data-bs-toggle="modal"
                      data-bs-target={"#modal-remove-" + index}
                    >
                      <IconTrash className="icon" />
                    </button>
                    <button className="btn-action">
                      <IconPencil className="icon" />
                    </button>
                    <button className="btn-action">
                      <IconPlus className="icon" />
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  {move.itemGroups.map((itemGroup, index) => (
                    <div key={index}>
                      <div className="hr-text">
                        <span>
                          <i className={itemGroup.icon} /> {itemGroup.name}
                        </span>
                      </div>

                      <p className="text-secondary">
                        {itemGroup.items.map((item, index) => (
                          <span key={index} className="text-secondary">
                            <strong>{item.quantity}x</strong> {item.name}
                          </span>
                        ))}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <DeleteMovementModal
            index={index}
            handleDeleteMovement={removeLocationMovements}
          />
        </div>
      ))}

      <div className="row m-3 align-items-center">
        <button type="button" className="btn btn-success">
          <IconDeviceFloppy className="icon" /> Cloturer la mission
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmitAddMovement)}>
        <div className="modal" id="modal-add-move">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Ajouter un mouvement</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label required">Origine</label>
                  <Controller
                    control={control}
                    name="from"
                    render={({ field }) => (
                      <Select
                        onChange={(val) => field.onChange(val.value)}
                        options={[
                          ...optionsType,
                          {
                            value: "ext",
                            label: "Externe",
                            icon: "ti ti-stack-push",
                          },
                        ]}
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
                  <label className="form-label required">Destination</label>
                  <Controller
                    control={control}
                    name="to"
                    render={({ field }) => (
                      <Select
                        onChange={(val) => field.onChange(val.value)}
                        options={[
                          ...optionsType,
                          {
                            value: "ext",
                            label: "Externe",
                            icon: "ti ti-stack-pop",
                          },
                        ]}
                        placeholder="Sélectionner"
                        required
                        styles={selectStyle}
                        value={optionsType.find((c) => c.value === field.value)}
                        components={{ Option: IconOption }}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <a
                  href="#"
                  className="btn btn-link link-secondary"
                  id="close-modal-add-move"
                  data-bs-dismiss="modal"
                >
                  Annuler
                </a>
                <button type="submit" className="btn btn-primary ms-auto">
                  <IconCubePlus className="icon" />
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default ItemsSelection;
