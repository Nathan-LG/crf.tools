import type { Metadata } from "next";
import ContentLayout from "@/components/ui/ContentLayout";
import { IconMoodEmpty, IconPlus } from "@tabler/icons-react";
import { prisma } from "@repo/db";
import config from "@/config.json";
import * as Sentry from "@sentry/nextjs";
import { redirect } from "next/navigation";
import EditUserModal from "@/components/users/EditUserModal";

// Metadata

export const metadata: Metadata = {
  title: "Bénévoles",
};

// ----------------------------

const Users = async () => {
  // Fetch all users

  let users: {
    group: {
      name: string;
    };
    id: string;
    name: string;
    email: string;
    image: string;
    phoneNumber: string;
    groupId: number;
    UserRoles: {
      roleId: number;
    }[];
  }[];

  let roles: {
    id: number;
    title: string;
    color: string;
  }[];

  let groups: {
    id: number;
    name: string;
  }[];

  try {
    users = await prisma.user.findMany({
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
        UserRoles: {
          select: {
            roleId: true,
          },
        },
        groupId: true,
      },
      orderBy: {
        email: "asc",
      },
    });
  } catch (error) {
    Sentry.captureException(error);
    redirect("/errors/500");
  }

  try {
    roles = await prisma.role.findMany({
      select: {
        id: true,
        title: true,
        color: true,
      },
    });
  } catch (error) {
    Sentry.captureException(error);
    redirect("/errors/500");
  }

  try {
    groups = await prisma.group.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  } catch (error) {
    Sentry.captureException(error);
    redirect("/errors/500");
  }

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
                  <th>Nom</th>
                  <th>Rôles</th>
                  <th>Groupe</th>
                  <th className="w-1"></th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  let color = "blue";

                  if (user.groupId === Number(config.groups.superadmin)) {
                    color = "red";
                  } else if (user.groupId === Number(config.groups.admin)) {
                    color = "green";
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
                            <div className="text-secondary">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          {user.UserRoles.length === 0 && "Aucun"}
                          {user.UserRoles.map((role) => {
                            return (
                              <span className="tag" key={role.roleId}>
                                <span
                                  className={
                                    "legend bg-" +
                                    roles.filter(
                                      (fullRole) => fullRole.id === role.roleId,
                                    )[0].color
                                  }
                                ></span>
                                {
                                  roles.filter(
                                    (fullRole) => fullRole.id === role.roleId,
                                  )[0].title
                                }
                              </span>
                            );
                          })}
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
                        <div className="btn-list flex-nowrap">
                          <button
                            className="btn"
                            data-bs-toggle="modal"
                            data-bs-target={
                              "#modal-edit-" +
                              user.email
                                .replace("@croix-rouge.fr", "")
                                .replace(".", "")
                            }
                          >
                            &Eacute;diter
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // Page data

  const pageData = {
    ariane: [
      { label: "agenda.crf", href: "/dashboard" },
      { label: "Bénévoles", href: "/dashboard/users" },
    ],
    title: "Liste des bénévoles",
    button: "Ajouter un bénévole",
    buttonIcon: <IconPlus className="icon" />,
    buttonLink: "/dashboard/users/add",
  };

  // DOM rendering

  return (
    <ContentLayout subHeaderProps={pageData}>
      <div className="row">{usersJSX}</div>

      {users.map((user) => {
        const userRoles = [];

        user.UserRoles.forEach((userRole) => {
          userRoles.push({
            value: userRole.roleId,
            label: roles.filter((role) => role.id === userRole.roleId)[0].title,
          });
        });

        return (
          <EditUserModal
            formProps={{
              user: {
                ...user,
                createdAt: undefined,
                updatedAt: undefined,
                emailVerified: false,
              },
              groups,
              roles,
              userRoles,
            }}
            key={user.email.replace("@croix-rouge.fr", "").replace(".", "")}
          />
        );
      })}
    </ContentLayout>
  );
};

export default Users;
