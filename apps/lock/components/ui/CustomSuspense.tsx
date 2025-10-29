"use client";

import { ReactNode } from "react";

export type SuspenseProps = {
  children: ReactNode;
  fallback: ReactNode;
  isLoading: boolean;
};

const CustomSuspense = ({ children, fallback, isLoading }: SuspenseProps) => (
  <>{isLoading ? fallback : children}</>
);

export default CustomSuspense;
