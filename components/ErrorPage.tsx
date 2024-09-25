import FullPageLayout from "@/components/FullPageLayout";

function ErrorPage({ error }) {
  return (
    <div>
      <FullPageLayout>
        <div className="page page-center">
          <div className="container-tight py-4">
            <div className="empty">
              <p className="empty-title">
                Oups… Vous venez de trouver une page d&apos;erreur !
              </p>
              <p className="empty-subtitle text-secondary">{error}</p>
            </div>
          </div>
        </div>
      </FullPageLayout>
    </div>
  );
}
export default ErrorPage;
