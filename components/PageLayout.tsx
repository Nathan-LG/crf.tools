import type { PageProps } from "@/app/utils/ts/definitions";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PageLayout = ({ children, pageGroup }: PageProps) => (
  <div className="page">
    <Header pageGroup={pageGroup}></Header>
    {children}
    <Footer></Footer>
  </div>
);

export default PageLayout;
