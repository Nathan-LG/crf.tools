"use client";

import { stateNumberToString } from "@/app/utils/ui/nuki";
import {
  IconAlertSquareRounded,
  IconHourglass,
  IconLock,
  IconLockOff,
  IconLockOpen,
  IconLockOpen2,
  IconLockOpenOff,
  IconQuestionMark,
  IconSettings,
} from "@tabler/icons-react";
import clsx from "clsx";

const StatusText = ({ status }) => {
  const icon = {
    0: <IconSettings className="icon" />,
    1: <IconLock className="icon" />,
    2: <IconLockOff className="icon" />,
    3: <IconLockOpen2 className="icon" />,
    4: <IconLockOpenOff className="icon" />,
    5: <IconLockOpen2 className="icon" />,
    6: <IconLockOpen className="icon" />,
    7: <IconLockOpen2 className="icon" />,
    253: <IconHourglass className="icon" />,
    254: <IconAlertSquareRounded className="icon" />,
  };

  return (
    <span className={clsx(status === 254 && "text-red")}>
      {icon[status] || <IconQuestionMark className="icon" />}{" "}
      {stateNumberToString(status)}
    </span>
  );
};

export default StatusText;
