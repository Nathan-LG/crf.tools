import type { Metadata } from "next";
import ContentLayout from "@/components/ui/ContentLayout";
import { IconMoodEmpty, IconPlus } from "@tabler/icons-react";
import { prisma } from "@repo/db";
import parsePhoneNumber from "libphonenumber-js";
import EditUserModal from "@/components/users/EditUserModal";
import DeleteModal from "@/components/ui/DeleteModal";
import Pagination from "@/components/ui/Pagination";
import { auth } from "auth";

// Metadata

const USERS_PER_PAGE = 30;

export async function generateMetadata({ searchParams }): Promise<Metadata> {
  const guests = (await searchParams).guests;
  let title = "Utilisateurs";

  if (guests === "0") {
    title = "Bénévoles";
  } else if (guests === "1") {
    title = "Invités";
  }

  return {
    title,
  };
}

// ----------------------------

const Users = async (props: {
  searchParams: Promise<{ [page: string]: string | string[] | undefined }>;
}) => {
  // Fetch users

  const urlParams = await props.searchParams;
  const guests = urlParams.guests;
  const currentPage = Number(urlParams?.page) || 1;
  const totalPages = await prisma.user
    .count()
    .then((count) => Math.ceil(count / USERS_PER_PAGE));

  const session = await auth();

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
      image: true,
      group: {
        select: {
          name: true,
        },
      },
      groupId: true,
      authorizations: {
        select: {
          lock: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      _count: {
        select: { logs: true },
      },
    },
    where: {
      groupId:
        guests === "1"
          ? 0
          : guests === "0"
            ? {
                not: 0,
              }
            : undefined,
    },
    orderBy: {
      name: "asc",
    },
    skip: (currentPage - 1) * USERS_PER_PAGE,
    take: USERS_PER_PAGE,
  });

  const groups = await prisma.group.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  // If no users are found

  let usersJSX = (
    <div className="col-12">
      <div className="card">
        <div className="empty">
          <div className="empty-icon">
            <IconMoodEmpty className="icon" />
          </div>
          <p className="empty-title">C&apos;est vide...</p>
          <p className="empty-subtitle text-secondary">
            Si vous pensez qu&apos;il s&apos;agit d&apos;une erreur, signalez-le
            au plus vite.
          </p>
        </div>
      </div>
    </div>
  );

  // Otherwise, display users

  if (users.length !== 0) {
    usersJSX = (
      <div className="col-12">
        <div className="card">
          <div className="table-responsive">
            <table className="table table-vcenter card-table">
              <thead>
                <tr>
                  <th>Utilisateur</th>
                  <th>Groupe</th>
                  <th>Accès</th>
                  <th className="w-1"></th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  let color = "grey";

                  if (user.groupId === 1) {
                    color = "blue";
                  } else if (user.groupId === 2) {
                    color = "green";
                  } else if (user.groupId === 3) {
                    color = "red";
                  }

                  return (
                    <tr key={user.id}>
                      <td>
                        <div className="d-flex py-1 align-items-center">
                          <span
                            className="avatar me-2"
                            style={{ backgroundImage: `url(${user.image})` }}
                          ></span>
                          <div className="flex-fill">
                            <div className="font-weight-medium">
                              {user.name}
                            </div>
                            <div className="text-secondary">
                              {user.phoneNumber &&
                                parsePhoneNumber(
                                  user.phoneNumber,
                                ).formatInternational()}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div>
                          <span
                            className={
                              "badge bg-" + color + " text-" + color + "-fg"
                            }
                          >
                            {user.group.name}
                          </span>
                        </div>
                      </td>

                      <td>
                        <div className="badges-list">
                          {user.authorizations.length === 0 && "Aucun"}
                          {user.authorizations
                            .filter(
                              (authorization, index, self) =>
                                index ===
                                self.findIndex(
                                  (a) => a.lock.id === authorization.lock.id,
                                ),
                            )
                            .map((authorization) => {
                              return (
                                <span key={authorization.lock.id}>
                                  <span className="badge">
                                    {authorization.lock.name}
                                  </span>{" "}
                                </span>
                              );
                            })}
                        </div>
                      </td>

                      <td>
                        <div
                          className="btn-list flex-nowrap"
                          style={{ flexDirection: "row-reverse" }}
                        >
                          <button
                            className="btn"
                            data-bs-toggle="modal"
                            data-bs-target={"#modal-edit-" + user.id}
                          >
                            &Eacute;diter
                          </button>
                          {user._count.logs === 0 &&
                            user.id !== session.user.id && (
                              <button
                                className="btn"
                                data-bs-toggle="modal"
                                data-bs-target={"#modal-delete-" + user.id}
                              >
                                Supprimer
                              </button>
                            )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          classNames="mt-4 justify-content-center"
        />
      </div>
    );
  }

  // Page data

  let userType = "utilisateurs";
  const ariane = [
    { label: "lock.crf", href: "/dashboard" },
    { label: "Utilisateurs", href: "/dashboard/users" },
  ];

  if (guests === "0") {
    userType = "bénévoles";
  } else if (guests === "1") {
    userType = "invités";
  }

  if (guests) {
    ariane.push({
      label: userType.charAt(0).toUpperCase() + userType.slice(1),
      href: `/dashboard/users?guests=${guests}`,
    });
  }

  const pageData = {
    ariane,
    title: "Liste des " + userType,
    button: "Ajouter un utilisateur",
    buttonIcon: <IconPlus className="icon" />,
    buttonLink: "/dashboard/users/add",
  };

  // DOM rendering

  return (
    <ContentLayout subHeaderProps={pageData}>
      <div className="row">{usersJSX}</div>

      {users.map((user) => {
        return (
          <div key={user.id}>
            <EditUserModal
              formProps={{
                user,
                groups,
              }}
              key={user.id}
            />

            <DeleteModal
              id={user.id}
              alert="Cela supprimera définitivement l'utilisateur."
              message="Utilisateur supprimé avec succès"
              url="/api/users/"
            />
          </div>
        );
      })}
    </ContentLayout>
  );
};

export default Users;
