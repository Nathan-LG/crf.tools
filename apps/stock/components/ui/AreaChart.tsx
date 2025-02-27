"use client";

import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const AreaChart = ({ options, series, height }) => {
  return (
    <Chart type="area" options={options} series={series} height={height} />
  );
};

export default AreaChart;
