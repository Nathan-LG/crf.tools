import type { Metadata } from "next";
import ContentLayout from "@/components/ui/ContentLayout";
import { IconMoodEmpty, IconPlus } from "@tabler/icons-react";
import { prisma } from "@repo/db";
import * as Sentry from "@sentry/nextjs";
import { redirect } from "next/navigation";
import AddRoleModal from "@/components/roles/AddRoleModal";

// Metadata

export const metadata: Metadata = {
  title: "Rôles",
};

// ----------------------------

const Users = async () => {
  // Fetch all roles

  let roles: {
    id: number;
    title: string;
    color: string;
  }[];

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

  // If no roles are found

  let rolesJSX = (
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

  if (roles.length !== 0) {
    rolesJSX = (
      <div className="col-12">
        <div className="card">
          <div className="table-responsive">
            <table className="table table-vcenter card-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Couleur</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role) => (
                  <tr key={role.id}>
                    <td>{role.title}</td>
                    <td>
                      <div>
                        <span
                          className={
                            "badge bg-" +
                            role.color +
                            " text-" +
                            role.color +
                            "-fg"
                          }
                        >
                          {role.color}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
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
      { label: "Rôles", href: "/dashboard/roles" },
    ],
    title: "Liste des rôles",
    button: "Ajouter un rôle",
    buttonIcon: <IconPlus className="icon" />,
    buttonLink: "",
    buttonModal: "modal-add-role",
  };

  // DOM rendering

  return (
    <ContentLayout subHeaderProps={pageData}>
      <div className="row">{rolesJSX}</div>
      <AddRoleModal />
    </ContentLayout>
  );
};

export default Users;
