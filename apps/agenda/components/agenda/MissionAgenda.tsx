import {
  IconCheck,
  IconClock,
  IconHourglassEmpty,
  IconPin,
  IconUser,
} from "@tabler/icons-react";
import { clsx } from "clsx";
import Link from "next/link";

const MissionAgenda = ({ event }) => {
  return (
    <div className="card mb-2">
      <div className={clsx("card-status-start", event.typeRaw)}></div>
      <div className="row row-0">
        <div className="col">
          <div className="card-header">
            <div>
              <h3 className="card-title">{event.name}</h3>
              <p className="card-subtitle">{event.type}</p>
            </div>
            <div className="card-actions">
              <a href="#" className="btn btn-action btn-2 me-4">
                {event.registration === 0 && <IconHourglassEmpty />}
                {event.registration === 1 && <IconCheck />}
              </a>
              <Link
                href={"/dashboard/missions/" + event.id}
                className="btn btn-primary btn-2"
              >
                Voir plus
              </Link>
            </div>
          </div>
          <div className="card-body">
            <p className="text-secondary">
              <span
                className={clsx(
                  "status",
                  event.state === -1 && "status-red",
                  event.state === 0 && "status-blue",
                  event.state === 1 && "status-green",
                  event.state >= 2 && "status-cyan",
                )}
              >
                <IconUser size={"18px"} />
                {event.state === -1 && "Annulée"}
                {event.state === 0 && "Inscriptions ouvertes"}
                {event.state === 1 && "Inscriptions closes"}
                {event.state >= 2 && "Terminé"}
              </span>{" "}
              <span className="status status-blue">
                <IconClock size={"18px"} />{" "}
                {event.start.getHours().toString().padStart(2, "0")}h
                {event.start.getMinutes().toString().padStart(2, "0")} à{" "}
                {event.end.getHours().toString().padStart(2, "0")}h
                {event.end.getMinutes().toString().padStart(2, "0")}
              </span>{" "}
              <span className="status status-blue">
                <IconPin size={"18px"} /> {event.location}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionAgenda;
