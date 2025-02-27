import type { Metadata } from "next";
import ErrorPage from "@/components/ui/ErrorPage";

export const metadata: Metadata = {
  title: "Erreur",
};

const InternalError = async () => {
  return <ErrorPage error={"Erreur interne du serveur"} />;
};
export default InternalError;
