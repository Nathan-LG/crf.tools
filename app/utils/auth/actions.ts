"use server";

import { signIn } from "@/auth";
import { cookies } from "next/headers";

export const handleGoogleSignIn = async () => {
  try {
    await signIn("google", { redirectTo: "/dashboard" });
  } catch (error) {
    throw error;
  }
};

export const isConnected = () => {
  return cookies().get("authjs.session-token") !== undefined;
};
