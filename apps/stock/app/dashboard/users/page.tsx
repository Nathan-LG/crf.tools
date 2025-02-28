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

  // Fetch all groups

  let groups: Group[];

  try {
    groups = await prisma.group.findMany();
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
                  <th>Téléphone</th>
                  <th>Groupe</th>
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
    buttonLink: "https://agenda.paris15.crf.tools/dashboard/users/add",
  };

  // DOM rendering

  return (
    <ContentLayout subHeaderProps={pageData}>
      <div className="row">{usersJSX}</div>
    </ContentLayout>
  );
};

export default Users;
