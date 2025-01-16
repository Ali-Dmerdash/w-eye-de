import React from "react";
import { SignIn } from "@clerk/nextjs";

export default function page() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <SignIn />
    </div>
  );
}
