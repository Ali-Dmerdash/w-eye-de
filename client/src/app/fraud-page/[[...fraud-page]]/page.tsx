"use client";
import React from "react";
import dynamic from "next/dynamic";
import Sidebar from "./components/Sidebar";
import FraudInc from "./components/FraudInc";
import TableTransaction from "./components/tableTransaction";
import Header from "./components/Header";
const Graph = dynamic(
  () => import("@/app/fraud-page/[[...fraud-page]]/components/graph"),
  { ssr: false }
);
const ReportAmeen = dynamic(
  () => import("@/app/fraud-page/[[...fraud-page]]/components/reportAmeen"),
  { ssr: false }
);
export default function Page() {
  return (
    <div className="bg-[#ff0000]">
    

    <main className=" transition-all duration-300 bg-[#ffffff]">
    <Header />
    <Sidebar />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 ">
        {/* Top Row */}
        <div className=" lg:col-span-2">
          <Graph />
        </div>

        <div className="lg:col-span-1">
          <FraudInc />
        </div>

        {/* Bottom Row */}
        <div className=" lg:col-span-2">
          <TableTransaction />
        </div>

        <div className=" lg:col-span-1">
          <ReportAmeen />
        </div>
      </div>
    </main>
    </div>
  )
}