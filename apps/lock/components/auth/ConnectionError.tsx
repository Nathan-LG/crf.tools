"use client";

import { IconExclamationCircle } from "@tabler/icons-react";
import { useSearchParams } from "next/navigation";

export const ConnectionError = () => {
  const error = useSearchParams().get("error");

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <div className="d-flex">
          <div>
            <IconExclamationCircle className="icon alert-icon"></IconExclamationCircle>
          </div>
          <div>
            <h4 className="alert-title">Impossible de vous connecter.</h4>
            <div className="text-secondary">{error}</div>
          </div>
        </div>
      </div>
    );
  }
};
