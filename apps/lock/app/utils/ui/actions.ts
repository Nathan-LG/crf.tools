"use client";

import Toastify from "toastify-js";

export const toast = async (error, message) => {
  let color = "linear-gradient(to right, #74b816, #75ad26)";
  if (error) {
    color = "linear-gradient(to right, #d63939, #c94f4f)";
  }

  Toastify({
    text: message,
    duration: 3000,
    style: {
      background: color,
    },
    className: "toastify-custom",
    gravity: "bottom",
    position: "right",
  }).showToast();
};

export const selectStyle = {
  control: (baseStyles, state) => ({
    ...baseStyles,
    borderColor: state.isFocused ? "#83b7e8" : "#dce1e7",
    boxShadow: state.isFocused
      ? "rgba(24, 36, 51, 0.06) 0px 1px 1px 0px, rgb(193, 219, 243) 0px 0px 0px 4px"
      : "none",
    padding: "1px",
  }),
};

export const selectStyleWithInput = {
  control: (baseStyles, state) => ({
    ...baseStyles,
    borderColor: state.isFocused ? "#83b7e8" : "#dce1e7",
    boxShadow: state.isFocused
      ? "rgba(24, 36, 51, 0.06) 0px 1px 1px 0px, rgb(193, 219, 243) 0px 0px 0px 4px"
      : "none",
    padding: "1px",
    borderRadius: "0 4px 4px 0",
  }),
};

export const generatePagination = (currentPage, totalPages) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
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

export const createPageURL = (searchParams, pathName, pageNumber) => {
  const params = new URLSearchParams(searchParams);
  params.set("page", pageNumber.toString());
  return `${pathName}?${params.toString()}`;
};
