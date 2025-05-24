"use client"

import React from "react";

interface LoadingOverlayProps {
  message?: string;
}

export default function LoadingOverlay({ message = "Loading..." }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 bg-white dark:bg-[#15191c] z-[100] flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#4B65AB] dark:border-white mb-4"></div>
        <p className="text-[#4B65AB] dark:text-white font-medium">{message}</p>
      </div>
    </div>
  );
} 