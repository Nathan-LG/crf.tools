import type { Metadata } from "next";
import ContentLayout from "@/components/ui/ContentLayout";
import { IconMoodEmpty, IconPlus } from "@tabler/icons-react";
import { prisma } from "@repo/db";
import config from "@/config.json";
import AddUserModal from "@/components/users/AddUserModal";
import EditUserModal from "@/components/users/EditUserModal";
import EditTempUserModal from "@/components/users/EditTempUserModal";
import DeleteModal from "@/components/ui/DeleteModal";
import * as Sentry from "@sentry/nextjs";
import { redirect } from "next/navigation";
import { Group } from "@repo/db";

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

  // Fetch all temp users

  let tempUsers: {
    id: string;
    email: string;
    phoneNumber: string;
  }[];

  try {
    tempUsers = await prisma.tempUser.findMany({
      select: {
        id: true,
        email: true,
        phoneNumber: true,
      },
      orderBy: {
        email: "asc",
      },
    });
  } catch (error) {
    Sentry.captureException(error);
    redirect("/errors/500");
  }

  // Fetch all groups

  let groups: Group[];

  try {
    groups = await prisma.group.findMany();
  } catch (error) {
    Sentry.captureException(error);
    redirect("/errors/500");
  }

  // DOM generation

  let tempUsersJSX = <></>;

  if (tempUsers.length !== 0) {
    // Display temp users

    tempUsersJSX = (
      <>
        <div className="col-12 mb-3">
          <div className="card">
            <div className="card-status-start bg-cyan"></div>
            <div className="card-body">
              <h3 className="card-title">Bénévoles en attente de connexion</h3>
              <div className="table-responsive">
                <table className="table table-vcenter card-table">
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Téléphone</th>
                      <th className="w-1"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {tempUsers.map((tempUser) => {
                      return (
                        <tr key={tempUser.id}>
                          <td>{tempUser.email}</td>
                          <td>{tempUser.phoneNumber}</td>
                          <td>
                            <div className="btn-list flex-nowrap">
                              <button
                                className="btn"
                                data-bs-toggle="modal"
                                data-bs-target={"#modal-edit-" + tempUser.id}
                              >
                                &Eacute;diter
                              </button>
                              <button
                                type="button"
                                className="btn"
                                data-bs-toggle="modal"
                                data-bs-target={"#modal-delete-" + tempUser.id}
                              >
                                Supprimer
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
        </div>
      </>
    );
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
                  <th>Téléphone</th>
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
                        <div>{user.phoneNumber}</div>
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
                        <button
                          className="btn"
                          data-bs-toggle="modal"
                          data-bs-target={"#modal-edit-" + user.id}
                        >
                          &Eacute;diter
                        </button>
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
      { label: "stock.crf", href: "/dashboard" },
      { label: "Bénévoles", href: "/dashboard/users" },
    ],
    title: "Liste des bénévoles",
    button: "Ajouter un bénévole",
    buttonIcon: <IconPlus className="icon" />,
    buttonLink: "",
    buttonModal: "modal-add-user",
  };

  // DOM rendering

  return (
    <ContentLayout subHeaderProps={pageData}>
      <div className="row">
        {tempUsersJSX}
        {usersJSX}
      </div>
      <AddUserModal />

      {tempUsers.map((tempUser) => (
        <>
          <EditTempUserModal tempUser={tempUser} key={tempUser.id} />
          <DeleteModal
            key={tempUser.id}
            id={tempUser.id}
            alert="Vous pourrez rajouter le bénévole plus tard."
            message="Bénévole supprimé avec succès"
            url="/api/users/"
          />
        </>
      ))}

      {users.map((user) => (
        <EditUserModal
          formProps={{
            user: {
              ...user,
              createdAt: undefined,
              updatedAt: undefined,
              emailVerified: false,
            },

            groups,
          }}
          key={user.id}
        />
      ))}
    </ContentLayout>
  );
};

export default Users;
