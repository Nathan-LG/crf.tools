import Head from "next/head";
import PageLayout from "@/components/ui/PageLayout";
import { PageProps } from "@/app/utils/ts/definitions";

const Dashboard = ({ children }: PageProps) => {
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
