"use client";

import {
  IconPlus,
  IconChevronRight,
  IconTrash,
  IconPencil,
  IconDeviceFloppy,
  IconCubePlus,
  IconSpherePlus,
} from "@tabler/icons-react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import toast, {
  selectStyle,
  selectStyleWithInput,
} from "@/app/utils/ui/actions";
import IconOption from "../ui/IconOptions";
import { useState } from "react";
import DeleteMovementModal from "./DeleteMovementModal";

const ItemsSelection = (props) => {
  const [moves, setMoves] = useState([]);
  const [movesModes, setMovesModes] = useState([]);
  const [currentMove, setCurrentMove] = useState(null);

  function onSubmitAddMovement(data) {
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
          itemCategories: [],
        },
      ]);

      setMovesModes([...movesModes, true]);

      document.getElementById("close-modal-add-move").click();
    }
  }

  function onSubmitAddItem(data) {
    const formData = data;
    const item = props.items.find((item) => item.id === formData.item);

    const newMoves = structuredClone(moves);

    if (
      newMoves[currentMove].itemCategories.find(
        (itemCategory) => itemCategory.id === item.ItemCategory.id,
      )
    ) {
      newMoves[currentMove].itemCategories
        .find((itemCategory) => itemCategory.id === item.ItemCategory.id)
        .items.push({
          id: item.id,
          name: item.name,
          quantity: formData.count,
        });
    } else {
      newMoves[currentMove].itemCategories.push({
        id: item.ItemCategory.id,
        name: item.ItemCategory.name,
        icon: item.ItemCategory.icon,
        items: [
          {
            id: item.id,
            name: item.name,
            quantity: formData.count,
          },
        ],
      });
    }

    setMoves(newMoves);
    setCurrentMove(null);
    document.getElementById("close-modal-add-item").click();
  }

  function switchMode(index) {
    console.log(index);
  }

  const optionsItems = props.items.map((item) => ({
    value: item.id,
    label: `${item.name} (${item.unit})`,
    icon: item.ItemCategory.icon,
  }));

  const optionsType = props.locations.map((location) => ({
    value: location.id,
    label: location.name,
    icon: location.type.icon,
  }));

  const { control, handleSubmit } = useForm();

  const idToNameLocation = (id) => {
    const location = props.locations.find((location) => location.id === id);
    return location ? location.name : "Externe";
  };

  const removeLocationMovements = () => {
    document.getElementById("close-modal-remove").click();
    setMoves(moves.filter((move, i) => i !== currentMove));
    setCurrentMove(null);
  };

  const {
    control: controlItem,
    register: registerItem,
    handleSubmit: handleSubmitItem,
  } = useForm();

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
                      data-bs-target="#modal-remove"
                      onClick={() => setCurrentMove(index)}
                    >
                      <IconTrash className="icon" />
                    </button>
                    <button
                      className="btn-action"
                      onClick={() => switchMode(index)}
                    >
                      <IconPencil className="icon" />
                    </button>
                    <button
                      className="btn-action"
                      data-bs-toggle="modal"
                      data-bs-target="#modal-add-item"
                      onClick={() => setCurrentMove(index)}
                    >
                      <IconPlus className="icon" />
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  {move.itemCategories.map((itemCategory, index) => (
                    <div key={index}>
                      <div className="hr-text">
                        <span>
                          <i className={itemCategory.icon} />{" "}
                          {itemCategory.name}
                        </span>
                      </div>

                      <p className="text-secondary">
                        {itemCategory.items.map((item, index) => (
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
        </div>
      ))}

      <div className="row m-3 align-items-center">
        <button type="button" className="btn btn-success">
          <IconDeviceFloppy className="icon" /> Cloturer la mission
        </button>
      </div>

      <form onSubmit={handleSubmitItem(onSubmitAddItem)}>
        <div className="modal" id="modal-add-item">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Ajouter un consommable</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label required">Quantité</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Combien ?"
                    {...registerItem("count", { required: true, min: 1 })}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label required">Consommable</label>
                  <Controller
                    control={controlItem}
                    name="item"
                    render={({ field }) => (
                      <Select
                        onChange={(val) => field.onChange(val.value)}
                        options={optionsItems}
                        placeholder="Sélectionner"
                        required
                        styles={selectStyleWithInput}
                        value={optionsItems.find(
                          (c) => c.value === field.value,
                        )}
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
                  id="close-modal-add-item"
                  data-bs-dismiss="modal"
                >
                  Annuler
                </a>
                <button type="submit" className="btn btn-primary ms-auto">
                  <IconSpherePlus className="icon" />
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>

      <DeleteMovementModal handleDeleteMovement={removeLocationMovements} />

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
