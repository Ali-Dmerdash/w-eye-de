"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@/components/ui/Sidebar";
import CompetitivePositioning from "./components/competitivePositioning";
import Strengths from "./components/strengths";
import Weaknesses from "./components/weaknesses";
import Opportunities from "./components/opportunities";
import Threats from "./components/threats";
import PricingComparison from "./components/pricingComparison";
import MarketMap from "./components/marketMap";
import Header from "@/components/ui/Header";
import Analysis from "./components/analysis";
import LoadingSpinner from "@/components/ui/loadingSpinner";

// Define an interface for the market data structure
// Adjust this based on the actual structure of your MongoDB data
interface MarketData {
  _id: string;
  swot_analysis: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  pricing_comparison: {
    competitors: { [key: string]: string };
    discount_strategies: string[];
  };
  competitive_positioning: {
    metrics: string[];
    scores: { [key: string]: string[] };
    visualization_note: string;
  };
  market_analysis: {
    trends: { name: string; growth: string; impact: string }[];
    market_share: { [key: string]: string };
  };
  recommendations: {
    immediate_actions: string[];
    strategic_initiatives: string[];
    urgent_alerts: string[];
  };
  // Add other fields from your MongoDB document as needed
}

export default function Page() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const updateSidebarState = () => {
      const isCollapsed =
        document.documentElement.getAttribute("data-sidebar-collapsed") ===
        "true";
      setIsCollapsed(isCollapsed);
    };

    updateSidebarState();

    const observer = new MutationObserver(updateSidebarState);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-sidebar-collapsed"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#15191c] transition-all duration-300">
      <Header />
      <Sidebar />

      <main
        className={`p-4 md:p-6 pt-20 transition-all duration-300 ${
          isCollapsed ? "sm:ml-16" : "sm:ml-64"
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 md:gap-6">
          {/* Top Row */}
          <div className="lg:min-h-[40vh] lg:col-span-2">
            <PricingComparison />
          </div>

          <div className="min-h-[400px] lg:min-h-[40vh] grid grid-cols-2 gap-2 lg:col-span-2 ">
            <Strengths />
            <Weaknesses />
            <Opportunities />
            <Threats />
          </div>

          <div className="lg:min-h-[40vh] lg:col-span-2">
            <CompetitivePositioning />
          </div>

          {/* Bottom Row */}
          <div className="lg:min-h-[40vh] lg:col-span-3 hidden md:block">
            <MarketMap />
          </div>

          <div className="lg:min-h-[40vh] lg:col-span-3 w-full">
            <Analysis />
          </div>
        </div>
      </main>
    </div>
  );
}
