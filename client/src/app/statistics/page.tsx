"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Sidebar from "@/components/ui/Sidebar";
import Header from "@/components/ui/Header";

export default function Page() {
  const [isCollapsed, setIsCollapsed] = useState(false);

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

  return (
    <div className="min-h-screen bg-[#15191c]">
      <Header />
      <Sidebar />

      <main
        className={`p-4 md:p-6 pt-20 transition-all duration-300 ${
          isCollapsed ? "sm:ml-16" : "sm:ml-64"
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 md:gap-6">
          {/* Top Row */}
        </div>
      </main>
    </div>
  );
}
