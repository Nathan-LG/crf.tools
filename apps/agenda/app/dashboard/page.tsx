import type { Metadata } from "next";
import ContentLayout from "@/components/ui/ContentLayout";

export const metadata: Metadata = {
  title: "Dashboard",
};

const pageData = {
  ariane: [{ label: "agenda.crf", href: "/dashboard" }],
  title: "Dashboard",
  button: "",
  buttonIcon: undefined,
  buttonLink: "",
};

const Dashboard = () => (
  <ContentLayout subHeaderProps={pageData}></ContentLayout>
);
export default Dashboard;
