"use client";

import React from "react";

// Define the interface for the market data prop (should match the one in page.tsx)
// Ensure this interface accurately reflects your MongoDB data structure
interface MarketData {
  _id: string;
  swot_analysis: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[]; // Expecting an array like ["Threat text", "(Source...)"]
  };
  // Include other fields as needed
  pricing_comparison?: { [key: string]: any };
  competitive_positioning?: { [key: string]: any };
  market_analysis?: { [key: string]: any };
  recommendations?: { [key: string]: any };
}

interface ThreatsProps {
  marketData: MarketData | null; // Accept the market data as a prop
}

export default function Threats({ marketData }: ThreatsProps) {
  // Handle cases where marketData or swot_analysis or threats might be null/missing/empty
  const threats = marketData?.swot_analysis?.threats;
  const hasThreats = threats && threats.length > 0;
  const threatText = hasThreats ? threats[0] : "No threats data available.";
  const threatSource = hasThreats && threats.length > 1 ? threats[1] : null;

  return (
    <div className="bg-[#1d2328] text-white font-bayon p-6 rounded-lg h-full flex flex-col text-center justify-center items-center shadow-inner-custom2">
      <span className="text-3xl text-orange-500 mb-2">Threats</span>
      {hasThreats ? (
        <>
          <div className="break-words leading-tight max-w-full">
            <span className="text-xs font-mulish">{threatText}</span>
          </div>
          {threatSource && (
            <span className="text-[0.50rem] font-mulish text-gray-400 mt-1">
              {threatSource}
            </span>
          )}
        </>
      ) : (
        <span className="text-xs font-mulish text-gray-400">{threatText}</span>
      )}
    </div>
  );
}
