"use client";

import Head from "next/head";
import FullPageLayout from "@/components/FullPageLayout";
import { IconBrandGoogleFilled } from "@tabler/icons-react";
import { useFormState } from "react-dom";
import { authenticate } from "@/app/utils/ts/actions";

function Login() {
  const [_, formAction, isPending] = useFormState(authenticate, undefined);

  return (
    <div>
      <Head>
        <title>Connexion - stock.crf</title>
        <meta charSet="utf-8" />
      </Head>
      <FullPageLayout>
        <div className="page page-center">
          <div className="container container-tight py-4">
            <div className="card card-md">
              <div className="card-body">
                <h2 className="h2 text-center mb-4">
                  Se connecter à stock.crf
                </h2>
                <div className="row">
                  <div className="col">
                    <form action={formAction}>
                      <button
                        type="submit"
                        className="btn w-100"
                        aria-disabled={isPending}
                      >
                        <IconBrandGoogleFilled className="icon"></IconBrandGoogleFilled>
                        Se connecter avec Google
                      </button>
                    </form>
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
