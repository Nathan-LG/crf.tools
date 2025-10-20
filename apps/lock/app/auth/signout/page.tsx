"use client";

import { handleGoogleSignOut } from "@/app/utils/auth/actions";
import { useEffect } from "react";

const Logout = () => {
  useEffect(() => {
    handleGoogleSignOut();
  });
};
export default Logout;
