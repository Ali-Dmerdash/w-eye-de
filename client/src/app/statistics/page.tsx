"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
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

      <main
        className={`h-full p-4 md:p-6 pt-20 transition-all duration-300 
        ${isCollapsed ? "sm:ml-16" : "sm:ml-64"}`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <h1 style={{ color: "white" }}>Statistics</h1>
        </div>
      </main>
    </div>
  );
}
