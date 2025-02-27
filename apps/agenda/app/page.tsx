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

  return (
    <ContentLayout subHeaderProps={pageData}>
      <div className="row">
        <div className="col-lg-6">
          <div className="card">
            <div className="card-body">
              <Agenda />
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
