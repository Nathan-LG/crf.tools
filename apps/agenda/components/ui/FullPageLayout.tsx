import type { PageProps } from "@/app/utils/ts/definitions";

const FullPageLayout = ({ children }: PageProps) => (
  <div className="d-flex flex-column">{children}</div>
);

export default FullPageLayout;
