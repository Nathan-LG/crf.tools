import clsx from "clsx";
import Link from "next/link";
import { ReactElement } from "react";

export type SubHeaderProps = {
  ariane: Array<{ label: string; href: string }>;
  title: string;
  button: string;
  buttonIcon: ReactElement;
  buttonLink: string;
  buttonModal?: string;
};

const SubHeader = ({
  ariane,
  title,
  button,
  buttonIcon,
  buttonLink,
  buttonModal,
}: SubHeaderProps) => {
  return (
    <div className="page-header d-print-none">
      <div className="container-xl">
        <div className="row g-2 align-items-center">
          <div className="col">
            <div className="mb-1">
              <ol className="breadcrumb" aria-label="breadcrumbs">
                {ariane.map(({ label, href }, index) => (
                  <li
                    key={index}
                    className={clsx(
                      "breadcrumb-item",
                      index === ariane.length - 1 && "active",
                    )}
                  >
                    <Link href={href}>{label}</Link>
                  </li>
                ))}
              </ol>
            </div>
            <h2
              className={clsx("page-title", title === "" && "visually-hidden")}
            >
              {title}
            </h2>
          </div>
          <div className="col-auto ms-auto d-print-none">
            <div className="btn-list">
              {buttonModal === undefined ? (
                <Link
                  href={buttonLink}
                  className={clsx(
                    "btn btn-primary d-none d-sm-inline-block",
                    button === "" && "visually-hidden",
                  )}
                >
                  {buttonIcon}
                  {button}
                </Link>
              ) : (
                <a
                  href="#"
                  className={clsx(
                    "btn btn-primary d-none d-sm-inline-block",
                    button === "" && "visually-hidden",
                  )}
                  data-bs-toggle="modal"
                  data-bs-target={"#" + buttonModal}
                >
                  {buttonIcon}
                  {button}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubHeader;
