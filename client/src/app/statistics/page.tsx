"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Sidebar from "@/components/ui/Sidebar";
import Header from "@/components/ui/Header";
import Stats from "@/assets/stats.png"
import Image from "next/image"



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
    <div className="min-h-screen transition-colors duration-300 dark:bg-[#15191c] bg-[#FAFAFA]">
      <Header />
      <Sidebar />

      <main
        className={`p-4 md:p-6 md:pt-20 pt-8 transition-all duration-300 ${isCollapsed ? "sm:ml-16" : "sm:ml-64"
          }`}
      >
        <div className="flex items-center justify-center">        <Image src={Stats} className="w-96 h-full object-cover" alt="Stats" />
        </div>
      </main>
    </div>
  );
}
