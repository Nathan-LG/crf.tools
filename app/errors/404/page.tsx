import type { Metadata } from "next";
import ErrorPage from "@/components/ui/ErrorPage";

export const metadata: Metadata = {
  title: "Erreur",
};

const NotFound = async () => {
  return <ErrorPage error={"La page n'existe pas."} />;
};
export default NotFound;
