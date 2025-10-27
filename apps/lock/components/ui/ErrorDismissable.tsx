import { IconExclamationCircle } from "@tabler/icons-react";

const ErrorDismissable = ({ error }) => (
  <div className="alert alert-danger alert-dismissible" role="alert">
    <div className="alert-icon">
      <IconExclamationCircle className="icon alert-icon icon-2" />
    </div>
    <div>{error}</div>

    <a className="btn-close" data-bs-dismiss="alert" aria-label="close"></a>
  </div>
);

export default ErrorDismissable;
