import type { Metadata } from "next";
import { auth } from "auth";
import { redirect } from "next/navigation";
import ContentLayout from "@/components/ui/ContentLayout";
import React from "react";

export const metadata: Metadata = {
  title: "Administration",
};

const pageData = {
  ariane: [{ label: "lock.crf", href: "/dashboard" }],
  title: "Administration",
  button: "",
  buttonIcon: undefined,
  buttonLink: "",
};

const Dashboard = async () => {
  const session = await auth();
  if (!session) redirect("/auth/signin");

  return (
    <ContentLayout subHeaderProps={pageData}>
      <div className="row"></div>
    </ContentLayout>
  );
};
export default Dashboard;
