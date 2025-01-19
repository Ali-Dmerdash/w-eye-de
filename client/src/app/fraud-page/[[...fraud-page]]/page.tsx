"use client";
import React from "react";
import dynamic from "next/dynamic";

const Graph = dynamic(() => import("./components/graph"), {
  ssr: false,
});

const FraudInc = dynamic(() => import("./components/FraudInc"), {
  ssr: false,
});

const TableTransaction = dynamic(
  () => import("./components/tableTransaction"),
  {
    ssr: false,
  }
);

export default function Page() {
  return (
    <div className="grid grid-cols-3 grid-rows-2 gap-4 w-full h-full p-4 bg-secondary ">
      <div className="col-span-2 row-span-1">
        <Graph />
      </div>

      <div className="col-span-1 row-span-2">
        <FraudInc />
      </div>

      <div className="col-span-2 row-span-1">
        <TableTransaction />
      </div>
    </div>
  );
}
