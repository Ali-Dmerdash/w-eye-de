"use client";

import React from "react";

// Define the interface for the market data prop (should match the one in page.tsx)
// Ensure this interface accurately reflects your MongoDB data structure
interface MarketData {
  _id: string;
  swot_analysis: {
    strengths: string[];
    weaknesses: string[]; // Expecting an array like ["Weakness text", "(Source...)"]
    opportunities: string[];
    threats: string[];
  };
  // Include other fields as needed
  pricing_comparison?: { [key: string]: any };
  competitive_positioning?: { [key: string]: any };
  market_analysis?: { [key: string]: any };
  recommendations?: { [key: string]: any };
}

interface WeaknessesProps {
  marketData: MarketData | null; // Accept the market data as a prop
}

export default function Weaknesses({ marketData }: WeaknessesProps) {
  // Handle cases where marketData or swot_analysis or weaknesses might be null/missing/empty
  const weaknesses = marketData?.swot_analysis?.weaknesses;
  const hasWeaknesses = weaknesses && weaknesses.length > 0;
  const weaknessText = hasWeaknesses
    ? weaknesses[0]
    : "No weaknesses data available.";
  const weaknessSource =
    hasWeaknesses && weaknesses.length > 1 ? weaknesses[1] : null;

  return (
    <div className="bg-[#1d2328] text-white font-bayon p-6 rounded-lg h-full flex flex-col text-center justify-center items-center shadow-inner-custom2">
      <span className="text-3xl text-red-500 mb-2">Weaknesses</span>
      {hasWeaknesses ? (
        <>
          <div className="break-words leading-tight max-w-full">
            <span className="text-xs font-mulish">{weaknessText}</span>
          </div>
          {weaknessSource && (
            <span className="text-[0.50rem] font-mulish text-gray-400 mt-1">
              {weaknessSource}
            </span>
          )}
        </>
      ) : (
        <span className="text-xs font-mulish text-gray-400">
          {weaknessText}
        </span>
      )}
    </div>
  );
}
