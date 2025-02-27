"use client";

import Toastify from "toastify-js";

export default async function toast(error, message) {
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
  }).showToast();
}

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
