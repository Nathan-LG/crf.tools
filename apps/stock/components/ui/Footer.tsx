import { IconHeartFilled, IconMugFilled } from "@tabler/icons-react";
import { env } from "process";

const Footer = () => (
  <footer className="footer footer-transparent d-print-none">
    <div className="container-xl">
      <div className="row text-center align-items-center flex-row-reverse">
        <div className="col-lg-auto ms-lg-auto">
          <ul className="list-inline list-inline-dots mb-0">
            <li className="list-inline-item">
              <a
                href="https://github.com/Nathan-LG/stock.crf"
                target="_blank"
                className="link-secondary"
                rel="noopener"
              >
                Code source
              </a>
            </li>
            {env.GIT_TAG && <li className="list-inline-item">{env.GIT_TAG}</li>}
          </ul>
        </div>
        <div className="col-12 col-lg-auto mt-3 mt-lg-0">
          <ul className="list-inline list-inline-dots mb-0">
            <li className="list-inline-item">
              stock.crf, pour la{" "}
              <a
                href="https://croix-rouge.fr"
                target="_blank"
                className="link-secondary"
              >
                Croix-Rouge française
              </a>
            </li>
            <li className="list-inline-item">
              Fait avec <IconHeartFilled className="icon" /> (et{" "}
              <IconMugFilled className="icon" />) par{" "}
              <a
                href="https://github.com/Nathan-LG"
                target="_blank"
                className="link-secondary"
              >
                Nathan-LG
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
