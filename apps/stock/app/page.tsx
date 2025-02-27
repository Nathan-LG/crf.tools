import Head from "next/head";
import FullPageLayout from "@/components/ui/FullPageLayout";
import Image from "next/image";
import Link from "next/link";
import { auth } from "auth";
import { redirect } from "next/navigation";
import { prisma } from "@repo/db";
import config from "@/config.json";
import MissionCodeForm from "@/components/ui/MissionCodeForm";

const MissionChoice = async () => {
  const session = await auth();
  if (!session) redirect("/auth/signin");

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      group: {
        select: {
          id: true,
        },
      },
    },
  });

  return (
    <div>
      <Head>
        <title>Choix de mission - stock.crf</title>
        <meta charSet="utf-8" />
      </Head>
      <FullPageLayout>
        <div className="page page-center">
          <div className="container container-tight py-4">
            <div className="text-center mb-4">
              <a href="." className="navbar-brand navbar-brand-autodark">
                <Image
                  className="navbar-brand-image"
                  src="/stockcrf.svg"
                  alt="stock.crf"
                  width="187"
                  height="32"
                ></Image>
              </a>
            </div>
            <div className="card card-md">
              <div className="card-body">
                <h2 className="h2 text-center mb-4">Choix de la mission</h2>
                <p className="text-secondary text-center">
                  Entrez le code mission à 6 chiffres.
                </p>
                <MissionCodeForm />
              </div>
            </div>
            {user.group.id !== config.groups.user && (
              <div className="text-center text-secondary mt-3">
                <Link href="/dashboard">Admin</Link>
              </div>
            )}
          </div>
        </div>
      </FullPageLayout>
    </div>
  );
};

export default MissionChoice;
