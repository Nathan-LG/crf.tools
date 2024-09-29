"use client";

import { handleGoogleSignIn } from "@/app/utils/auth/actions";
import { IconBrandGoogleFilled } from "@tabler/icons-react";

export const SignInButton = () => (
  <button
    type="submit"
    className="btn w-100"
    onClick={() => handleGoogleSignIn()}
  >
    <IconBrandGoogleFilled className="icon"></IconBrandGoogleFilled>
    Se connecter avec Google
  </button>
);
