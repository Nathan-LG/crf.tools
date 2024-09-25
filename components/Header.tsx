import Image from "next/image";

async function Header() {
  return (
    <div className="page">
      <header className="navbar navbar-expand-sm navbar-light d-print-none">
        <div className="container-xl">
          <h1 className="navbar-brand navbar-brand-autodark d-none-navbar-horizontal pe-0 pe-md-3">
            <a href="#">
              <Image
                src="/stockcrf.svg"
                alt="stock.crf"
                width="187"
                height="32"
              />
            </a>
          </h1>

          <div className="navbar-nav flex-row order-md-last">
            <div className="nav-item">
              <a href="#" className="nav-link d-flex lh-1 text-reset p-0">
                <span
                  className="avatar avatar-sm"
                  style={{ backgroundImage: "url(...)" }}
                ></span>
                <div className="d-none d-xl-block ps-2">
                  <div>Paweł Kuna</div>
                  <div className="mt-1 small text-secondary">UI Designer</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Header;
