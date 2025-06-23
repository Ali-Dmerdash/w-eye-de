"use client"

import React, { useEffect, useState } from "react";

interface LoadingOverlayProps {
  message?: string;
  showProgress?: boolean;
}

export default function LoadingOverlay({ message = "Loading...", showProgress = false }: LoadingOverlayProps) {
  const [showEmergencyButton, setShowEmergencyButton] = useState(false);

  // Show emergency button after 5 seconds of loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowEmergencyButton(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleEmergencyExit = () => {
    console.log("Emergency exit triggered from LoadingOverlay");
    // Force redirect to home page
    window.location.href = "/home-page";
  };

  return (
    <div className="fixed inset-0 bg-white dark:bg-[#15191c] z-[100] flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#4B65AB] dark:border-white mb-4"></div>
        <p className="text-[#4B65AB] dark:text-white font-medium">{message}</p>
        {showProgress && (
          <div className="mt-4 w-48 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div className="bg-[#4B65AB] dark:bg-white h-2 rounded-full animate-pulse" style={{ width: "60%" }}></div>
          </div>
        )}
        
        {showEmergencyButton && (
          <button
            onClick={handleEmergencyExit}
            className="mt-6 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            🚨 Force Continue
          </button>
        )}
      </div>
    </div>
  );
} 