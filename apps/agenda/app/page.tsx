import type { Metadata } from "next";
import { auth } from "auth";
import { redirect } from "next/navigation";
import ContentLayout from "@/components/ui/ContentLayout";
import Agenda from "@/components/agenda/Agenda";
import { getEvents } from "./utils/agenda/actions";

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

  const events = await getEvents(oneYearBefore, oneYearLater);

  return (
    <ContentLayout subHeaderProps={pageData}>
      <div className="row">
        <div className="col-lg-6">
          <div className="card">
            <div className="card-body">
              <Agenda events={events} />
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Missions</h3>
            </div>
            <div className="card-body">
              <p>Commencez par sélectionner une date.</p>
            </div>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
};
export default Dashboard;
