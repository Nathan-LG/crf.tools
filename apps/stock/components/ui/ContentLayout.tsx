import SubHeader from "@/components/ui/SubHeader";
import { SubHeaderProps } from "@/components/ui/SubHeader";
import { ReactNode } from "react";

type ContentProps = {
  children?: ReactNode;
  subHeaderProps?: SubHeaderProps;
};

const ContentLayout = ({ children, subHeaderProps }: ContentProps) => (
  <>
    <SubHeader
      ariane={subHeaderProps.ariane}
      title={subHeaderProps.title}
      button={subHeaderProps.button}
      buttonIcon={subHeaderProps.buttonIcon}
      buttonLink={subHeaderProps.buttonLink}
      buttonModal={subHeaderProps.buttonModal}
    />
    <div className="page-body">
      <div className="container-xl">{children}</div>
    </div>
  </>
);

export default ContentLayout;
