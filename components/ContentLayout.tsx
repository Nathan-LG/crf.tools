import type { PageProps } from "@/app/utils/ts/definitions";
import SubHeader from "./SubHeader";

const ContentLayout = ({ children, pageData }: PageProps) => (
  <>
    <SubHeader
      ariane={pageData.ariane}
      title={pageData.title}
      button={pageData.button}
      buttonIcon={pageData.buttonIcon}
      buttonLink={pageData.buttonLink}
    />
    <div className="page-body">
      <div className="container-xl">{children}</div>
    </div>
  </>
);

export default ContentLayout;
