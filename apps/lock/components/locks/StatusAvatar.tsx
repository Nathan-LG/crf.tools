"use client";

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

const StatusAvatar = ({ status }) => {
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
    <>
      {icon[Number(status)] ? (
        <span
          className={clsx(
            "avatar avatar-xl mb-3",
            status === 254 ? "bg-red-lt" : "bg-green-lt",
          )}
        >
          {icon[Number(status)]}
        </span>
      ) : (
        <span className="avatar avatar-xl mb-3 bg-grey-lt">
          <IconQuestionMark className="icon" />
        </span>
      )}
    </>
  );
};

export default StatusAvatar;
