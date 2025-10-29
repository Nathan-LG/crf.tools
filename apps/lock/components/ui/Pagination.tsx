"use client";

import clsx from "clsx";
import Link from "next/link";
import { createPageURL, generatePagination } from "@/app/utils/ui/actions";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { usePathname, useSearchParams } from "next/navigation";

const Pagination = ({ currentPage, totalPages, classNames }) => {
  const allPages = generatePagination(currentPage, totalPages);

  const searchParams = useSearchParams();
  const pathName = usePathname();

  return (
    <ul className={clsx("pagination", classNames)}>
      {
        <>
          <PaginationArrow
            direction="left"
            href={createPageURL(searchParams, pathName, currentPage - 1)}
            isDisabled={currentPage <= 1}
          />

          {allPages.map((page, index) => {
            return (
              <PaginationNumber
                key={`${page}-${index}`}
                href={createPageURL(searchParams, pathName, page)}
                page={page}
                isActive={currentPage === page}
              />
            );
          })}

          <PaginationArrow
            direction="right"
            href={createPageURL(searchParams, pathName, currentPage + 1)}
            isDisabled={currentPage >= totalPages}
          />
        </>
      }
    </ul>
  );
};

function PaginationNumber({
  page,
  href,
  isActive,
  position,
}: {
  page: number | string;
  href: string;
  position?: "first" | "last" | "middle" | "single";
  isActive: boolean;
}) {
  return (
    <li
      className={clsx(
        "page-item",
        (isActive || position === "middle") && "active",
      )}
    >
      {isActive || position === "middle" ? (
        <span className="page-link">{page}</span>
      ) : (
        <Link href={href} className="page-link">
          {page}
        </Link>
      )}
    </li>
  );
}

function PaginationArrow({
  href,
  direction,
  isDisabled,
}: {
  href: string;
  direction: "left" | "right";
  isDisabled?: boolean;
}) {
  const icon =
    direction === "left" ? (
      <IconChevronLeft className="icon icon-1" width={24} height={24} />
    ) : (
      <IconChevronRight className="icon icon-1" width={24} height={24} />
    );

  return (
    <li className={clsx("page-item", isDisabled && "disabled")}>
      {!isDisabled ? (
        <Link className="page-link" href={href}>
          {icon}
        </Link>
      ) : (
        <span className="page-link">{icon}</span>
      )}
    </li>
  );
}

export default Pagination;
