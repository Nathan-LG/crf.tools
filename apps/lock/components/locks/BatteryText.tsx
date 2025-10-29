"use client";

import {
  IconBattery1,
  IconBattery2,
  IconBattery3,
  IconBattery4,
  IconBatteryExclamation,
  IconBatteryCharging,
  IconBattery,
} from "@tabler/icons-react";

const BatteryText = ({ online, level, isCharging }) => {
  let battery;

  if (!online) {
    battery = (
      <span className="text-grey">
        <IconBattery className="icon" /> ?? %
      </span>
    );
  } else if (isCharging) {
    battery = (
      <span className="text-blue">
        <IconBatteryCharging className="icon" /> {level} %
      </span>
    );
  } else if (level <= 10) {
    battery = (
      <span className="text-red">
        <IconBatteryExclamation className="icon" /> {level} %
      </span>
    );
  } else if (level <= 25) {
    battery = (
      <span className="text-orange">
        <IconBattery1 className="icon" /> {level} %
      </span>
    );
  } else if (level <= 50) {
    battery = (
      <span className="text-green">
        <IconBattery2 className="icon" /> {level} %
      </span>
    );
  } else if (level <= 75) {
    battery = (
      <span className="text-green">
        <IconBattery3 className="icon" /> {level} %
      </span>
    );
  } else {
    battery = (
      <span className="text-green">
        <IconBattery4 className="icon" /> {level} %
      </span>
    );
  }

  return battery;
};

export default BatteryText;
