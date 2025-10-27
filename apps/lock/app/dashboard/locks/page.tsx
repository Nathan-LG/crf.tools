import type { Metadata } from "next";
import ContentLayout from "@/components/ui/ContentLayout";
import {
  IconLock,
  IconLockOpen2,
  IconMoodEmpty,
  IconPlus,
  IconInfoCircle,
} from "@tabler/icons-react";
import { prisma } from "@repo/db";
import parsePhoneNumber from "libphonenumber-js";
import Link from "next/link";

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
          <div className="col-md-6 col-lg-4" key={lock.id}>
            <div className="card">
              <div className="card-body p-4 text-center">
                <span className="avatar avatar-xl mb-3 bg-green-lt">
                  <IconLock className="icon-lg text-green" size={40} />
                </span>
                <h3 className="m-0 mb-1">{lock.name}</h3>
                <div className="text-secondary">
                  {lock.phoneNumber
                    ? parsePhoneNumber(lock.phoneNumber).formatInternational()
                    : "Pas de téléphone"}
                </div>
                <div className="mt-3">
                  <span className="badge bg-green-lt">80 %</span>
                </div>
              </div>
              <div className="d-flex">
                <a href="#" className="card-btn">
                  <IconLock className="icon me-2 text-muted icon-3" />
                  Verrouiller
                </a>
                <a href="#" className="card-btn">
                  <IconLockOpen2 className="icon me-2 text-muted icon-3" />
                  Déverrouiller
                </a>
              </div>
              <div className="d-flex">
                <Link href={`/dashboard/locks/${lock.id}`} className="card-btn">
                  <IconInfoCircle className="icon me-2 text-muted icon-3" />
                  Plus d&apos;informations
                </Link>
              </div>
            </div>
          </div>
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
