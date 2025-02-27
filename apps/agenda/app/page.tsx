import Head from "next/head";
import FullPageLayout from "@/components/ui/FullPageLayout";
import Link from "next/link";
import { auth } from "auth";
import { redirect } from "next/navigation";
import { prisma } from "@repo/db";
import config from "@/config.json";

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
        <title>Choix de mission - agenda.crf</title>
        <meta charSet="utf-8" />
      </Head>
      <FullPageLayout>
        <div className="page page-center">
          <div className="container container-tight py-4">
            <div className="text-center mb-4 h1">
              <a href="." className="navbar-brand navbar-brand-autodark">
                agenda.crf
              </a>
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
