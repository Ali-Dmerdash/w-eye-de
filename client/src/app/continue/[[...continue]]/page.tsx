"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import LoadingOverlay from "@/components/ui/LoadingOverlay";


export default function Page() {
  

  return (
    <div>
      <LoadingOverlay message="Website is loading..." />
    </div>
  );
}
