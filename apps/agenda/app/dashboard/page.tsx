import type { Metadata } from "next";
import { auth } from "auth";
import { redirect } from "next/navigation";
import ContentLayout from "@/components/ui/ContentLayout";
import Agenda from "@/components/agenda/Agenda";
import { getEvents } from "../utils/agenda/actions";
import React from "react";

export const metadata: Metadata = {
  title: "Agenda",
};

const pageData = {
  ariane: [{ label: "agenda.crf", href: "/dashboard" }],
  title: "Agenda",
  button: "",
  buttonIcon: undefined,
  buttonLink: "",
};

const Dashboard = async () => {
  const session = await auth();
  if (!session) redirect("/auth/signin");

  const oneYearBefore = new Date();
  oneYearBefore.setFullYear(oneYearBefore.getFullYear() - 1);

  const oneYearLater = new Date();
  oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

  const events = await getEvents(session.user.id, oneYearBefore, oneYearLater);

  return (
    <ContentLayout subHeaderProps={pageData}>
      <div className="row">
        <Agenda events={events} />
      </div>
    </ContentLayout>
  );
};
export default Dashboard;
