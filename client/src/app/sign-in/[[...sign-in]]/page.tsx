import React from "react";
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex h-screen">
      <div className="flex-1 bg-gray-100 flex items-center justify-center p-3">
        <div className="w-full h-full bg-blue-500 rounded-[40px] flex items-center justify-center">
          <h1 className="text-white text-2xl font-bold">Logo</h1>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center bg-white">
        <SignIn routing="hash" />
      </div>
    </div>
  );
}
