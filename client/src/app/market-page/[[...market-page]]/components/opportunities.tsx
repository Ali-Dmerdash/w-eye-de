"use client";

import React from "react";

// Define the interface for the market data prop (should match the one in page.tsx)
// Ensure this interface accurately reflects your MongoDB data structure
interface MarketData {
  _id: string;
  swot_analysis: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[]; // Expecting an array like ["Opportunity text", "(Source...)"]
    threats: string[];
  };
  // Include other fields as needed
  pricing_comparison?: { [key: string]: any };
  competitive_positioning?: { [key: string]: any };
  market_analysis?: { [key: string]: any };
  recommendations?: { [key: string]: any };
}

interface OpportunitiesProps {
  marketData: MarketData | null; // Accept the market data as a prop
}

export default function Opportunities({ marketData }: OpportunitiesProps) {
  // Handle cases where marketData or swot_analysis or opportunities might be null/missing/empty
  const opportunities = marketData?.swot_analysis?.opportunities;
  const hasOpportunities = opportunities && opportunities.length > 0;
  const opportunityText = hasOpportunities
    ? opportunities[0]
    : "No opportunities data available.";
  const opportunitySource =
    hasOpportunities && opportunities.length > 1 ? opportunities[1] : null;

  return (
    <div className="bg-[#1d2328] text-white font-bayon p-6 rounded-lg h-full flex flex-col text-center justify-center items-center shadow-inner-custom2">
      <span className="text-3xl text-yellow-500 mb-2">Opportunities</span>
      {hasOpportunities ? (
        <>
          <div className="break-words leading-tight max-w-full">
            <span className="text-xs font-mulish">{opportunityText}</span>
          </div>
          {opportunitySource && (
            <span className="text-[0.50rem] font-mulish text-gray-400 mt-1">
              {opportunitySource}
            </span>
          )}
        </>
      ) : (
        <span className="text-xs font-mulish text-gray-400">
          {opportunityText}
        </span>
      )}
    </div>
  );
}
