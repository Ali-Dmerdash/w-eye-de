"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@/components/ui/Sidebar";
import Header from "@/components/ui/Header";
import Dashboard from "./statistics";

export default function Page() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Listen for changes to the sidebar state
  useEffect(() => {
    const updateSidebarState = () => {
      const isCollapsed =
        document.documentElement.getAttribute("data-sidebar-collapsed") ===
        "true";
      setIsCollapsed(isCollapsed);
    };

    // Initial check
    updateSidebarState();

    // Set up a mutation observer to watch for attribute changes
    const observer = new MutationObserver(updateSidebarState);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-sidebar-collapsed"],
    });

    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="min-h-screen transition-colors duration-300 dark:bg-[#15191c] bg-white">
      <Header />
      <Sidebar />

      <main
        className={`p-4 md:p-6 pt-8 transition-all duration-300 ${
          isCollapsed ? "sm:ml-16" : "sm:ml-64"
        }`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-[80vh]">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4B65AB]"></div>
              <p className="mt-4 text-gray-500 dark:text-gray-400">Loading analytics data...</p>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#15191c] rounded-xl shadow-sm dark:shadow-none p-4 md:p-6 pt-0 max-w-[1600px] mx-auto transition-colors duration-300">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-[#15191c] dark:text-white">Analytics Dashboard</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Monitor your business performance with real-time data</p>
            </div>
            <Dashboard />
          </div>
        )}
      </main>
    </div>
  );
}
