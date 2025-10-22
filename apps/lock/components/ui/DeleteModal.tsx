"use client";

import { toast } from "@/app/utils/ui/actions";
import { IconAlertTriangle } from "@tabler/icons-react";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useState } from "react";

type ModalForm = {
  id: number | string;
  url: string;
  alert: string;
  message: string;
  button?: string;
};

const DeleteModal = (modalParams: ModalForm) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`${modalParams.url}${modalParams.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!data.success) {
        toast(true, data.error.message);
      } else {
        toast(false, modalParams.message);
      }
    } catch (error) {
      toast(true, error.message);
    }
    setIsLoading(false);
    document.getElementById(`close-modal-delete-${modalParams.id}`).click();
    router.refresh();
  };

  return (
    <div
      className="modal"
      key={modalParams.id}
      id={"modal-delete-" + modalParams.id}
    >
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
            <div className="text-secondary">{modalParams.alert}</div>
          </div>
          <div className="modal-footer">
            <div className="w-100">
              <div className="row">
                <div className="col">
                  <a
                    href="#"
                    className="btn w-100"
                    data-bs-dismiss="modal"
                    id={"close-modal-delete-" + modalParams.id}
                  >
                    Retour
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
                    {modalParams.button || "Supprimer"}
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
