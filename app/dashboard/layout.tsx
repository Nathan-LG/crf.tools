"use client";

import Head from "next/head";
import PageLayout from "@/components/PageLayout";
import { PageProps } from "@/app/utils/ts/definitions";
import getPageType from "@/app/utils/paths/actions";

const Dashboard = async ({ children }: PageProps) => {
  const pageType = getPageType();

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
      </Head>
      <div className="page-wrapper">
        <PageLayout pageGroup={pageType}>{children}</PageLayout>
      </div>
    </>
  );
};

export default Dashboard;
