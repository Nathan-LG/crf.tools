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
