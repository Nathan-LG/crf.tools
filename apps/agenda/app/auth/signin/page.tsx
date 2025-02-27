import Head from "next/head";
import FullPageLayout from "@/components/ui/FullPageLayout";

import { SignInButton } from "@/components/auth/SignInButton";
import { Suspense } from "react";
import { ConnectionError } from "@/components/auth/ConnectionError";
import { auth } from "auth";
import { redirect } from "next/navigation";

async function Login() {
  const session = await auth();
  if (session) redirect("/");

  return (
    <div>
      <Head>
        <title>Connexion - agenda.crf</title>
        <meta charSet="utf-8" />
      </Head>
      <FullPageLayout>
        <div className="page page-center">
          <div className="container container-tight py-4">
            <div className="text-center mb-4 h1">
              <a href="." className="navbar-brand navbar-brand-autodark">
                agenda.crf
              </a>
            </div>
            <div className="card card-md">
              <div className="card-body">
                <h2 className="h2 text-center mb-4">Se connecter</h2>
                <div className="row">
                  <div className="col">
                    <Suspense>
                      <ConnectionError />
                    </Suspense>
                    <SignInButton />
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center text-secondary mt-3">
              Vous n&apos;avez pas encore vos accès ? Rendez-vous sur Google
              Chat.
            </div>
          </div>
        </div>
      </FullPageLayout>
    </div>
  );
}
export default Login;
