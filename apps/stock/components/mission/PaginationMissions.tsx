"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const PaginationMissions = ({ totalPages }: { totalPages: number }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const generatePagination = (currentPage: number, totalPages: number) => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, "...", totalPages - 1, totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
    }

    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  return (
    <div className="card-footer d-flex align-items-center">
      <p className="m-0 text-secondary">
        Missions <span>{(currentPage - 1) * 20}</span> à{" "}
        <span>{currentPage * 20}</span>
      </p>
      <ul className="pagination m-0 ms-auto">
        {generatePagination(currentPage, totalPages).map((page, index) => (
          <li
            key={index}
            className={clsx("page-item", currentPage === page && "active")}
          >
            {typeof page === "number" ? (
              <Link
                className="page-link"
                href={`${pathname}?page=${page}`}
                aria-disabled={currentPage === page}
              >
                {page}
              </Link>
            ) : (
              <span className="page-link">...</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PaginationMissions;
