import { IconProps } from "@tabler/icons-react";
import { ComponentType } from "react";

type SingleStatCardProps = {
  Icon: ComponentType<IconProps>;
  color: string;
  number: number;
  labelSingular: string;
  labelPlural: string;
};

export const SingleStatCard = ({
  Icon,
  color,
  number,
  labelSingular,
  labelPlural,
}: SingleStatCardProps) => (
  <div className="col-md-6 col-xl-3">
    <div className="card card-sm">
      <div className="card-body">
        <div className="row align-items-center">
          <div className="col-auto">
            <span className={`bg-${color} text-white avatar`}>
              <Icon size={24} />
            </span>
          </div>
          <div className="col">
            <div>
              {number} {number > 1 ? labelPlural : labelSingular}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
