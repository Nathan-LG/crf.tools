"use client";

import Head from "next/head";
import FullPageLayout from "@/components/FullPageLayout";
import { IconExclamationCircle } from "@tabler/icons-react";
import Image from "next/image";

import { SignInButton } from "@/components/SignInButton";
import { useSearchParams } from "next/navigation";

function Login() {
  const error = useSearchParams().get("error");

  return (
    <div>
      <Head>
        <title>Connexion - stock.crf</title>
        <meta charSet="utf-8" />
      </Head>
      <FullPageLayout>
        <div className="page page-center">
          <div className="container container-tight py-4">
            <div className="text-center mb-4">
              <a href="." className="navbar-brand navbar-brand-autodark">
                <Image
                  className="navbar-brand-image"
                  src="/stockcrf.svg"
                  alt="stock.crf"
                  width="187"
                  height="32"
                ></Image>
              </a>
            </div>
            <div className="card card-md">
              <div className="card-body">
                <h2 className="h2 text-center mb-4">Se connecter</h2>
                <div className="row">
                  <div className="col">
                    {error && (
                      <div className="alert alert-danger" role="alert">
                        <div className="d-flex">
                          <div>
                            <IconExclamationCircle className="icon alert-icon"></IconExclamationCircle>
                          </div>
                          <div>
                            <h4 className="alert-title">
                              Impossible de vous connecter.
                            </h4>
                            <div className="text-secondary">{error}</div>
                          </div>
                        </div>
                      </div>
                    )}
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
