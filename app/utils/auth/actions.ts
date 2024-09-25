"use server";

import { signIn, signOut } from "@/auth";
import { redirect } from "next/navigation";

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
    console.log(error);
    throw error;
  }
};
