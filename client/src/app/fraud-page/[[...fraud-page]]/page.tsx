import React from "react";
import TableTransaction from "@/app/fraud-page/[[...fraud-page]]/components/tableTransaction";
import Graph from "@/app/fraud-page/[[...fraud-page]]/components/graph";
import FraudInc from "@/app/fraud-page/[[...fraud-page]]/components/FraudInc";

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
