import Head from "next/head";
import PageLayout from "@/components/ui/PageLayout";
import { PageProps } from "@/app/utils/ts/definitions";
import { auth } from "auth";
import { redirect } from "next/navigation";

const Dashboard = async ({ children }: PageProps) => {
  const session = await auth();
  if (!session) redirect("/auth/signin");

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
      </Head>
      <div className="page-wrapper">
        <PageLayout>{children}</PageLayout>
      </div>
    </>
  );
};

export default Dashboard;
