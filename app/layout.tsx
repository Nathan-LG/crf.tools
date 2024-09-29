import { PageProps } from "@/app/utils/ts/definitions";

import "@/app/utils/styles/globals.css";
import "@tabler/core/dist/css/tabler.min.css";
import "@tabler/icons-webfont/dist/tabler-icons.css";

import "toastify-js/src/toastify.css";

import Script from "next/script";
import type { Metadata } from "next";

import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: {
    template: "%s - stock.crf",
    default: "stock.crf",
  },
};

const RootLayout = ({ children }: PageProps) => (
  <html lang="fr">
    <SessionProvider>
      <body>
        <main>{children}</main>
        <Script src="https://cdn.jsdelivr.net/npm/@tabler/core@1.0.0-beta17/dist/js/tabler.min.js" />
      </body>
    </SessionProvider>
  </html>
);

export default RootLayout;
