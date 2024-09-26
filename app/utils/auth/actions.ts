"use server";

import { signIn, signOut } from "@/auth";

export const handleGoogleSignIn = async () => {
  try {
    await signIn("google", { redirectTo: "/dashboard" });
  } catch (error) {
    throw error;
  }
};

export const handleGoogleSignOut = async () => {
  try {
    await signOut({ redirectTo: "/auth/signin" });
  } catch (error) {
    throw error;
  }
};
