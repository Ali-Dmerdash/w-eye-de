"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@/components/ui/Sidebar";
import Header from "@/components/ui/Header";
import Dashboard from "./statistics";

export default function Page() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

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
      // Trigger animations after loading is complete
      setTimeout(() => {
        setIsLoaded(true);
      }, 100);
    }, 800);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#15191c] transition-all duration-300">
      <Header />
      <Sidebar />

      <main
        className={`p-4 md:p-6 pt-20 transition-all duration-300 ${
          isCollapsed ? "sm:ml-16" : "sm:ml-64"
        }`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-[80vh]">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
              <p className="mt-4 text-gray-500 dark:text-gray-400">Loading analytics data...</p>
            </div>
          </div>
        ) : (
          <div className="max-w-[1600px] mx-auto">
            {/* Header Section */}
            <div className="mb-8 flex flex-row justify-between items-center">
              <div>
                <h1 className={`text-3xl font-bold text-gray-900 dark:text-white mb-2 transform transition-all duration-700 ease-out ${
                  isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}>Analytics Dashboard</h1>
                <p className={`text-gray-500 dark:text-gray-400 transform transition-all duration-700 ease-out delay-100 ${
                  isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}>Monitor your business performance with real-time data and insights</p>
              </div>
            </div>

            {/* Dashboard Content */}
            <div className={`transform transition-all duration-700 ease-out delay-200 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <Dashboard />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
