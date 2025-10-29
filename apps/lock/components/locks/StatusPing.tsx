"use client";

const StatusPing = ({ status }) => {
  return status ? (
    <span className="status-indicator status-green status-indicator-animated">
      <span className="status-indicator-circle"></span>
      <span className="status-indicator-circle"></span>
      <span className="status-indicator-circle"></span>
    </span>
  ) : (
    <span className="status-indicator status-red">
      <span className="status-indicator-circle"></span>
    </span>
  );
};

export default StatusPing;
