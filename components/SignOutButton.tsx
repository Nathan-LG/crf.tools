"use client";

import { signOut } from "next-auth/react";
import { IconLogout } from "@tabler/icons-react";

export const SignOutButton = () => (
  <div className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
    <a href="#" className="dropdown-item" onClick={() => signOut()}>
      <IconLogout className="icon dropdown-item-icon" />
      Se déconnecter
    </a>
  </div>
);
