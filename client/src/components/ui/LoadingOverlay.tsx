"use client"

import React from "react";

export default function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-white dark:bg-[#15191c] z-50 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300 font-medium">Loading...</p>
      </div>
    </div>
  );
} 