import { ReactNode } from "react";

export type User = {
  id: number;
  name: string;
  email: string;
};

export type PageProps = {
  children?: ReactNode;
  title?: string;
};
