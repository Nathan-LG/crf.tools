import type { Metadata } from "next";
import ContentLayout from "@/components/ui/ContentLayout";
import { IconMoodEmpty, IconPlus } from "@tabler/icons-react";
import { prisma } from "@repo/db";
import LockCard from "@/components/locks/LockCard";

// Metadata

export const metadata: Metadata = {
  title: "Serrures",
};

// ----------------------------

const Locks = async () => {
  // Fetch locks

  const locks = await prisma.lock.findMany({
    select: {
      id: true,
      name: true,
      phoneNumber: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  // If no locks are found

  let locksJSX = (
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

  // Otherwise, display locks

  if (locks.length !== 0) {
    locksJSX = (
      <>
        {locks.map((lock) => (
          <LockCard key={lock.id} lock={lock} />
        ))}
      </>
    );
  }

  // Page data

  const pageData = {
    ariane: [
      { label: "lock.crf", href: "/dashboard" },
      { label: "Serrures", href: "/dashboard/locks" },
    ],
    title: "Liste des serrures",
    button: "Ajouter une serrure",
    buttonIcon: <IconPlus className="icon" />,
    buttonLink: "/dashboard/locks/add",
  };

  // DOM rendering

  return (
    <ContentLayout subHeaderProps={pageData}>
      <div className="row row-cards">{locksJSX}</div>
    </ContentLayout>
  );
};

export default Locks;
