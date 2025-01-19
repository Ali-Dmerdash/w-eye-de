"use client";
import React from "react";
import Graph from "./components/graph";
import dynamic from "next/dynamic";

const TableTransaction = dynamic(
  () => import("./components/tableTransaction"),
  {
    ssr: false,
  }
);

export default function page() {
  return (
    <div>
      <TableTransaction />
    </div>
  );
}
