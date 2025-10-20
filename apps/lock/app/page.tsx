import { auth } from "auth";
import { redirect } from "next/navigation";

const HomeRedirect = async () => {
  const session = await auth();
  if (!session) redirect("/auth/signin");
  else redirect("/dashboard");
};

export default HomeRedirect;
