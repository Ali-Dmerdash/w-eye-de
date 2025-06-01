"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Sidebar from "@/components/ui/Sidebar";
import Header from "@/components/ui/Header";
import LoadingSpinner from "@/components/ui/loadingSpinner"; // Import loading spinner

// Import updated components that accept props
import RevenueChart from "./components/revenueChart";
import KeyFactors from "./components/keyFactors";
import Analysis from "./components/analysis";

// Import Redux hook and types
import { useGetRevenueDataQuery } from "@/state/api";
import { RevenueTrend } from "@/state/type";

// Keep the original Graph component import (uses static data)
const Graph = dynamic(() => import("./components/graph"), { ssr: false });

export default function Page() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Fetch data using the Redux hook
  const { data: trends, isLoading, error } = useGetRevenueDataQuery();

  // Extract the first trend object (assuming the API always returns at least one if successful)
  const trendData: RevenueTrend | undefined | null = trends?.[0];

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

    return () => observer.disconnect();
  }, []);

  // Handle loading state for the whole section
  if (isLoading) {
    return (
      <div className="min-h-screen transition-colors duration-300 bg-[#FAFAFA] dark:bg-[#15191c]">
        <Header />
        <Sidebar />
        <main
          className={`p-4 md:p-6 md:pt-20 pt-8 transition-all duration-300 ${
            isCollapsed ? "sm:ml-16" : "sm:ml-64"
          } flex items-center justify-center min-h-[calc(100vh-theme(spacing.20))-"`}
        >
          <LoadingSpinner width="10rem" height="10rem" />
        </main>
      </div>
    );
  }

  // Handle error state for the whole section
  if (error) {
    let errorMessage = "Failed to load revenue data";
    if ("status" in error) {
      errorMessage =
        "error" in error ? error.error : JSON.stringify(error.data);
    } else if ("message" in error) {
      errorMessage = error.message ?? errorMessage;
    }
    return (
      <div className="min-h-screen transition-colors duration-300 bg-[#FAFAFA] dark:bg-[#15191c]">
        <Header />
        <Sidebar />
        <main
          className={`p-4 md:p-6 md:pt-20 pt-8 transition-all duration-300 ${
            isCollapsed ? "sm:ml-16" : "sm:ml-64"
          } flex items-center justify-center min-h-[calc(100vh-theme(spacing.20))-"`}
        >
          <div className="text-red-500 text-center p-6 bg-red-100 dark:bg-red-900/30 rounded-lg">
            <p>Error loading revenue data:</p>
            <p>{errorMessage}</p>
          </div>
        </main>
      </div>
    );
  }

  // Render the page with data passed as props
  return (
    <div className="min-h-screen transition-colors duration-300 bg-[#FAFAFA] dark:bg-[#15191c]">
      <Header />
      <Sidebar />

      <main
        className={`p-4 md:p-6 md:pt-20 pt-8 transition-all duration-300 ${
          isCollapsed ? "sm:ml-16" : "sm:ml-64"
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Top Row */}
          <div className=" lg:min-h-[40vh]">
            {/* Pass trendData to RevenueChart */}
            <RevenueChart trendData={trendData} />
          </div>

          <div className="min-h-[400px] lg:min-h-[40vh] lg:col-span-2">
            {/* Graph component remains unchanged (uses static data) */}
            <Graph />
          </div>

          {/* Bottom Row */}
          <div className="lg:min-h-[40vh] w-full">
            {/* Pass key_factors to KeyFactors */}
            <KeyFactors keyFactorsData={trendData?.key_factors} />
          </div>

          <div className="lg:min-h-[40vh] lg:col-span-2 w-full ">
            {/* Pass analysis to Analysis */}
            <Analysis analysisData={trendData?.analysis} />
          </div>
        </div>
      </main>
    </div>
  );
}
