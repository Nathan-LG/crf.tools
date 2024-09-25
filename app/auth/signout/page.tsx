"use client";

import { handleGoogleSignOut } from "@/app/utils/auth/actions";

const Logout = () => {
  handleGoogleSignOut();
};
export default Logout;
