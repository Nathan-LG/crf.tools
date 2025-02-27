"use client";

import { IconAlertTriangle } from "@tabler/icons-react";

const DeleteItemModal = ({ handleDeleteItem }) => {
  return (
    <div className="modal" id="modal-remove-item">
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
            <div className="text-secondary">
              Vous allez supprimer le mouvement du consommable.
            </div>
          </div>
          <div className="modal-footer">
            <div className="w-100">
              <div className="row">
                <div className="col">
                  <a
                    href="#"
                    className="btn w-100"
                    data-bs-dismiss="modal"
                    id="close-modal-remove-item"
                  >
                    Retour
                  </a>
                </div>
                <div className="col">
                  <button
                    className="btn btn-danger w-100"
                    onClick={() => handleDeleteItem()}
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

export default DeleteItemModal;
