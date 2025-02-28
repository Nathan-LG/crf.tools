import { clsx } from "clsx";

const MissionAgenda = ({ event }) => {
  return (
    <div className="card mb-2">
      <div className={clsx("card-status-start", event.type)}></div>
      <div className="row row-0">
        <div className="col">
          <div className="card-body">
            <h3 className="card-title">{event.name}</h3>
            <p className="text-secondary">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam
              deleniti fugit incidunt, iste, itaque minima neque pariatur
              perferendis sed suscipit velit vitae voluptatem.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionAgenda;
