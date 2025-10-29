"use client";

import { fetcher } from "@/app/utils/data/actions";
import { IconKey, IconSettings } from "@tabler/icons-react";
import Link from "next/link";
import useSWR from "swr";
import CustomSuspense from "../ui/CustomSuspense";
import BatteryText from "./BatteryText";
import StatusText from "./StatusText";
import StatusPing from "./StatusPing";

const LockHeader = ({ lock }) => {
  const swrData = useSWR(`/api/locks/${lock.id}/nuki`, fetcher, {
    refreshInterval: 10000,
  });

  return (
    <div className="row g-3 align-items-center">
      <div className="col-auto">
        <CustomSuspense
          fallback={
            <span className="status-indicator status-yellow">
              <span className="status-indicator-circle"></span>
            </span>
          }
          isLoading={swrData.isLoading}
        >
          <StatusPing status={swrData.data?.nukiData?.online} />
        </CustomSuspense>
      </div>
      <div className="col">
        <h2 className="page-title">
          <span style={{ display: "inline-block", marginRight: "0.5rem" }}>
            {lock.name}{" "}
          </span>
          {swrData.data?.success
            ? !swrData.data?.nukiData?.online && (
                <span className="badge bg-red-lt">Hors ligne</span>
              )
            : !swrData.isLoading && (
                <span className="badge bg-red-lt">Serrure inconnue</span>
              )}
        </h2>
        <div className="text-secondary">
          <ul className="list-inline list-inline-dots mb-0">
            <li className="list-inline-item placeholder-glow">
              <CustomSuspense
                fallback={
                  <div
                    className="placeholder placeholder-s"
                    style={{ width: "50px" }}
                  ></div>
                }
                isLoading={swrData.isLoading}
              >
                <BatteryText
                  online={swrData.data?.nukiData?.online}
                  level={swrData.data?.nukiData?.battery?.level}
                  isCharging={swrData.data?.nukiData?.battery?.isCharging}
                />
              </CustomSuspense>
            </li>
            <li className="list-inline-item placeholder-glow">
              <CustomSuspense
                fallback={
                  <div
                    className="placeholder placeholder-s"
                    style={{ width: "100px" }}
                  ></div>
                }
                isLoading={swrData.isLoading}
              >
                <StatusText status={swrData.data?.nukiData?.status} />
              </CustomSuspense>
            </li>
          </ul>
        </div>
      </div>
      <div className="col-md-auto ms-auto d-print-none">
        <div className="btn-list">
          <a
            href="#"
            className="btn btn-2"
            data-bs-toggle="modal"
            data-bs-target={"#modal-edit"}
          >
            <IconSettings className="icon me-2" />
            Paramètres
          </a>
          <Link
            href={`/dashboard/locks/${lock.id}/authorizations`}
            className="btn btn-primary btn-3"
          >
            <IconKey className="icon me-2" />
            Gérer les accès
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LockHeader;
