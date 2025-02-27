import { auth } from "auth";
import { prisma } from "@repo/db";
import { SignOutButton } from "@/components/auth/SignOutButton";
import {
  IconBandage,
  IconBriefcase2,
  IconBuildingWarehouse,
  IconHeartbeat,
  IconUsers,
} from "@tabler/icons-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import config from "@/config.json";

async function Header() {
  const session = await auth();
  if (!session) redirect("/auth/signin");

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      name: true,
      group: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (user.group.id === config.groups.user) {
    redirect("/");
  }

  return (
    <div className="page">
      <header className="navbar navbar-expand-md navbar-light d-print-none">
        <div className="container-xl">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbar-menu"
            aria-controls="navbar-menu"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <h1 className="navbar-brand navbar-brand-autodark d-none-navbar-horizontal pe-0 pe-md-3">
            <Link href="/dashboard">stock.crf</Link>
          </h1>

          <div className="navbar-nav flex-row order-md-last">
            <div className="nav-item dropdown">
              <a
                href="#"
                className="nav-link d-flex lh-1 text-reset p-0"
                data-bs-toggle="dropdown"
              >
                <span
                  className="avatar avatar-sm"
                  style={{ backgroundImage: `url(${session.user.image})` }}
                ></span>
                <div className="d-none d-xl-block ps-2">
                  <div>{user.name}</div>
                  <div className="mt-1 small text-secondary">
                    {user.group.name}
                  </div>
                </div>
              </a>
              <SignOutButton />
            </div>
          </div>
        </div>
      </header>
      <header className="navbar-expand-md">
        <div className="collapse navbar-collapse" id="navbar-menu">
          <div className="navbar">
            <div className="container-xl">
              <div className="row flex-fill align-items-center">
                <div className="col">
                  <ul className="navbar-nav">
                    <li className="nav-item">
                      <Link className="nav-link" href="/dashboard">
                        <span className="nav-link-icon d-md-none d-lg-inline-block">
                          <IconHeartbeat className="Icon" />
                        </span>
                        <span className="nav-link-title">Dashboard</span>
                      </Link>
                    </li>
                    <li className="nav-item dropdown">
                      <a
                        className="nav-link"
                        data-bs-toggle="dropdown"
                        role="button"
                      >
                        <span className="nav-link-icon d-md-none d-lg-inline-block">
                          <IconBuildingWarehouse className="Icon" />
                        </span>
                        <span className="nav-link-title">Emplacements</span>
                      </a>
                      <div className="dropdown-menu dropdown-menu-start">
                        <Link
                          className="dropdown-item"
                          href="/dashboard/locations"
                        >
                          Liste
                        </Link>
                        <Link
                          className="dropdown-item"
                          href="/dashboard/locations/types"
                        >
                          Catégories
                        </Link>
                      </div>
                    </li>
                    <li className="nav-item dropdown">
                      <a
                        className="nav-link"
                        data-bs-toggle="dropdown"
                        role="button"
                      >
                        <span className="nav-link-icon d-md-none d-lg-inline-block">
                          <IconBandage className="Icon" />
                        </span>
                        <span className="nav-link-title">Consommables</span>
                      </a>
                      <div className="dropdown-menu dropdown-menu-start">
                        <Link className="dropdown-item" href="/dashboard/items">
                          Liste
                        </Link>
                        <Link
                          className="dropdown-item"
                          href="/dashboard/items/categories"
                        >
                          Catégories
                        </Link>
                      </div>
                    </li>
                    <li className="nav-item dropdown">
                      <a
                        className="nav-link"
                        data-bs-toggle="dropdown"
                        role="button"
                      >
                        <span className="nav-link-icon d-md-none d-lg-inline-block">
                          <IconBriefcase2 className="Icon" />
                        </span>
                        <span className="nav-link-title">Missions</span>
                      </a>
                      <div className="dropdown-menu dropdown-menu-start">
                        <Link
                          className="dropdown-item"
                          href="/dashboard/missions"
                        >
                          Liste
                        </Link>
                        <Link
                          className="dropdown-item disabled"
                          href="/dashboard/missions/search"
                        >
                          Recherche<span className="badge ms-2">WIP</span>
                        </Link>
                      </div>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" href="/dashboard/users">
                        <span className="nav-link-icon d-md-none d-lg-inline-block">
                          <IconUsers className="Icon" />
                        </span>
                        <span className="nav-link-title">Bénévoles</span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Header;
