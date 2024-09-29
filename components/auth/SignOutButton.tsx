import { IconLogout } from "@tabler/icons-react";
import Link from "next/link";

export const SignOutButton = () => (
  <div className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
    <Link href="/auth/signout" className="dropdown-item">
      <IconLogout className="icon dropdown-item-icon" />
      Se déconnecter
    </Link>
  </div>
);
