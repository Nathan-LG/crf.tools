"use client";

import type { PageProps } from "@/app/utils/ts/definitions";
import { IconAlertTriangle } from "@tabler/icons-react";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Toastify from "toastify-js";

const DeleteModal = ({ pageData }: PageProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`${pageData.url}${pageData.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!data.success) {
        Toastify({
          text: data.error.message,
          duration: 3000,
          style: {
            background: "linear-gradient(to right, #d63939, #c94f4f)",
          },
        }).showToast();
      } else {
        Toastify({
          text: "Catégorie d'emplacement supprimée avec succès",
          duration: 3000,
          style: {
            background: "linear-gradient(to right, #74b816, #75ad26)",
          },
        }).showToast();
      }
    } catch (error) {
      Toastify({
        text: error.message,
        duration: 3000,
        style: {
          background: "linear-gradient(to left, #d63939, #c94f4f)",
        },
      }).showToast();
    }
    setIsLoading(false);
    document.getElementById(`close-modal-${pageData.id}`).click();
    router.refresh();
  };

  return (
    <div className="modal" key={pageData.id} id={"modal-" + pageData.id}>
      <div className="modal-dialog modal-sm" role="document">
        <div className="modal-content">
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
          <div className="modal-status bg-danger"></div>
          <div className="modal-body text-center py-4">
            <IconAlertTriangle className="icon mb-2 text-danger icon-lg" />
            <h3>&Ecirc;tes-vous sûr ?</h3>
            <div className="text-secondary">{pageData.alert}</div>
          </div>
          <div className="modal-footer">
            <div className="w-100">
              <div className="row">
                <div className="col">
                  <a
                    href="#"
                    className="btn w-100"
                    data-bs-dismiss="modal"
                    id={"close-modal-" + pageData.id}
                  >
                    Annuler
                  </a>
                </div>
                <div className="col">
                  <button
                    className={clsx(
                      "btn btn-danger w-100",
                      isLoading && "btn-loading",
                    )}
                    disabled={isLoading}
                    onClick={handleDelete}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
