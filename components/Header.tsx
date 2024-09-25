import { auth } from "@/auth";
import { prisma } from "@/prisma";
import Image from "next/image";
import { SignOutButton } from "@/components/SignOutButton";

async function Header() {
  const session = await auth();

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      name: true,
      group: {
        select: {
          name: true,
        },
      },
    },
  });

  return (
    <div className="page">
      <header className="navbar navbar-expand-sm navbar-light d-print-none">
        <div className="container-xl">
          <h1 className="navbar-brand navbar-brand-autodark d-none-navbar-horizontal pe-0 pe-md-3">
            <a href="#">
              <Image
                src="/stockcrf.svg"
                alt="stock.crf"
                width="187"
                height="32"
              />
            </a>
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
    </div>
  );
}

export default Header;
