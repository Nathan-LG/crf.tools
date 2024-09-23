import Head from "next/head";
import { Metadata } from "next";
import FullPageLayout from "@/components/FullPageLayout";
import { IconBrandGoogleFilled, IconMoodSmile } from "@tabler/icons-react";

export const metadata: Metadata = {
  title: "Connexion",
};

const Login = () => (
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
              <h2 className="h2 text-center mb-4">Se connecter à stock.crf</h2>
              <div className="row">
                <div className="col">
                  <a href="#" className="btn w-100">
                    <IconBrandGoogleFilled className="icon"></IconBrandGoogleFilled>
                    Se connecter avec Google
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center text-secondary mt-3">
            Vous n'avez pas encore vos accès ? Rendez-vous sur Google Chat.
          </div>
        </div>
      </div>
    </FullPageLayout>
  </div>
);
export default Login;
