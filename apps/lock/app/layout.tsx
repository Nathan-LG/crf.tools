import { PageProps } from "@/app/utils/ts/definitions";

import "@/app/utils/styles/globals.css";
import "@tabler/core/dist/css/tabler.min.css";
import "@tabler/core/dist/css/tabler-vendors.min.css";
import "@tabler/icons-webfont/dist/tabler-icons.css";
import "tom-select/dist/css/tom-select.default.css";

import "toastify-js/src/toastify.css";

import Script from "next/script";
import type { Metadata } from "next";

import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: {
    template: "%s - lock.crf",
    default: "lock.crf",
  },
};

const RootLayout = ({ children }: PageProps) => (
  <html lang="fr" data-scroll-behavior="smooth">
    <SessionProvider>
      <body>
        <main>{children}</main>
      </body>
      <Script src="https://cdn.jsdelivr.net/npm/@tabler/core@1.0.0-beta17/dist/js/tabler.min.js" />
      <Script src="https://cdn.jsdelivr.net/npm/tom-select@2.3.1/dist/js/tom-select.complete.min.js" />
    </SessionProvider>
  </html>
);

export default RootLayout;
