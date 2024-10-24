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
import Link from "next/link";
import DeleteItemModal from "./DeleteItemModal";
import closeMission from "@/app/utils/missions/closeMission";
import clsx from "clsx";

const ItemsSelection = (props) => {
  const [moves, setMoves] = useState([]);
  const [movesModes, setMovesModes] = useState([]);
  const [currentMove, setCurrentMove] = useState(null);
  const [currentItem, setCurrentItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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

      setMovesModes([...movesModes, false]);

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
    resetFieldItem("count");
    document.getElementById("close-modal-add-item").click();
  }

  async function onSubmitCloseMission(data) {
    setIsLoading(true);

    const formData = data;
    const result = await closeMission(formData.comment, moves, props.missionId);

    setIsLoading(false);

    if (result === false) {
      toast(true, "Une erreur est survenue lors de la clôture de la mission.");
    }
  }

  const removeLocationMovements = () => {
    document.getElementById("close-modal-remove-movement").click();
    setMoves(moves.filter((move, i) => i !== currentMove));
    setMovesModes(movesModes.filter((mode, i) => i !== currentMove));
    setCurrentMove(null);
  };

  const removeItem = () => {
    document.getElementById("close-modal-remove-item").click();

    let move = null;

    for (let i = 0; i < movesModes.length; i++) {
      if (movesModes[i]) {
        move = i;
        break;
      }
    }

    const newMoves = structuredClone(moves);
    newMoves[move].itemCategories.forEach((itemCategory) => {
      itemCategory.items = itemCategory.items.filter(
        (item) => item.id !== currentItem,
      );
    });

    setMoves(newMoves);

    const newMovesModes = structuredClone(movesModes);

    for (let i = 0; i < newMovesModes.length; i++) {
      newMovesModes[i] = false;
    }

    setMovesModes(newMovesModes);

    setCurrentMove(null);
    setCurrentItem(null);
  };

  function switchMode(index) {
    const newMovesModes = structuredClone(movesModes);

    for (let i = 0; i < newMovesModes.length; i++) {
      if (i !== index) {
        newMovesModes[i] = false;
      }
    }

    newMovesModes[index] = !newMovesModes[index];
    setMovesModes(newMovesModes);
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

  const {
    control: controlItem,
    register: registerItem,
    resetField: resetFieldItem,
    handleSubmit: handleSubmitItem,
  } = useForm();

  const { register: registerClose } = useForm();

  return (
    <>
      <button
        className="btn btn-primary w-100 mt-3"
        data-bs-toggle="modal"
        data-bs-target="#modal-add-move"
      >
        <IconPlus className="icon" /> Ajouter un mouvement
      </button>
      {moves.map((move, indexMove) => (
        <div key={indexMove}>
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
                      data-bs-target="#modal-remove-movement"
                      onClick={() => setCurrentMove(indexMove)}
                    >
                      <IconTrash className="icon" />
                    </button>
                    <button
                      className="btn-action"
                      onClick={() => switchMode(indexMove)}
                    >
                      <IconPencil className="icon" />
                    </button>
                    <button
                      className="btn-action"
                      data-bs-toggle="modal"
                      data-bs-target="#modal-add-item"
                      onClick={() => setCurrentMove(indexMove)}
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
                            <strong>{item.quantity}x</strong> {item.name}{" "}
                            {movesModes[indexMove] && (
                              <Link
                                href="#"
                                data-bs-toggle="modal"
                                data-bs-target="#modal-remove-item"
                                onClick={() => setCurrentItem(item.id)}
                              >
                                <IconTrash className="icon" />
                              </Link>
                            )}
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
        <button
          type="button"
          className="btn btn-success"
          data-bs-toggle="modal"
          data-bs-target="#modal-close-mission"
        >
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
      <DeleteItemModal handleDeleteItem={removeItem} />

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

      <form onSubmit={handleSubmit(onSubmitCloseMission)}>
        <div className="modal" id="modal-close-mission">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Cloturer la mission</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Commentaire</label>
                  <textarea
                    className="form-control"
                    placeholder="Champ libre pour ajouter un commentaire sur le matériel"
                    {...registerClose("comment", { required: false })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <a
                  href="#"
                  className="btn btn-link link-secondary"
                  id="close-modal-close-mission"
                  data-bs-dismiss="modal"
                >
                  Annuler
                </a>
                <button
                  type="submit"
                  className={clsx(
                    "btn btn-success ms-auto",
                    isLoading && "btn-loading",
                  )}
                  disabled={isLoading}
                >
                  <IconDeviceFloppy className="icon" />
                  Cloturer
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
