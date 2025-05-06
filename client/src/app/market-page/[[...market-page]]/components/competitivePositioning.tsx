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
    threats: string[];
  };
  pricing_comparison: {
    competitors: { [key: string]: string }; // e.g., { "Xiaomi": "599 (Source...)" }
    discount_strategies: string[];
  };
  competitive_positioning: {
    metrics: string[];
    scores: { [key: string]: string[] }; // e.g., { "Xiaomi": ["8 (Source...)", "20%", "4.5", "9"] }
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
  // Add other fields as needed
}

interface CompetitivePositioningProps {
  marketData: MarketData | null; // Accept the market data as a prop
}

export default function CompetitivePositioning({
  marketData,
}: CompetitivePositioningProps) {
  // Handle cases where marketData or necessary nested data might be null/missing
  if (
    !marketData ||
    !marketData.competitive_positioning ||
    !marketData.pricing_comparison
  ) {
    return (
      <div className="p-8 bg-[#1d2328] rounded-lg h-full flex flex-col justify-center items-center text-white shadow-inner-custom2">
        Loading competitive positioning data or data unavailable...
      </div>
    );
  }

  // Destructure the necessary data from the prop
  const { scores } = marketData.competitive_positioning;
  const prices = marketData.pricing_comparison.competitors;

  // Check if scores and prices objects exist and are not empty
  const hasScores = scores && Object.keys(scores).length > 0;
  const hasPrices = prices && Object.keys(prices).length > 0;

  return (
    <div className="p-8 bg-[#1d2328] rounded-lg h-full flex flex-col shadow-inner-custom2">
      <div className="flex items-center justify-between mb-6">
        <div className="font-mulish">
          <h2 className="text-lg font-semibold text-white">
            Competitive Positioning
          </h2>
        </div>
      </div>

      <div className="overflow-x-auto flex-grow text-[0.6rem] text-left font-mulish">
        <table className="w-full">
          <thead>
            <tr className="text-gray-400 uppercase border-b-[1px] border-[#56577A]">
              {/* Dynamically generate headers from metrics if needed, or keep static */}
              <th className="py-1">Name</th>
              <th className="text-center py-1">Market Share</th>
              <th className="text-center py-1">Price</th>
              <th className="text-center py-1">Satisfaction</th>
              <th className="text-center py-1">Innovation</th>
            </tr>
          </thead>
          <tbody className="text-white">
            {hasScores && hasPrices ? (
              Object.entries(scores).map(([name, scoreArray]) => {
                // Safely extract price, handle if competitor name doesn't exist in prices object
                const priceString = prices[name];
                const priceValue = priceString?.match(/\d+/)?.[0] ?? "N/A";

                // Ensure scoreArray has enough elements before accessing indices
                const marketShare = scoreArray?.[1] ?? "N/A";
                const satisfaction = scoreArray?.[2] ?? "N/A";
                const innovation = scoreArray?.[3] ?? "N/A";

                return (
                  <tr
                    key={name}
                    className="hover:bg-gray-800/50 border-b-[1px] border-[#56577A]"
                  >
                    <td className="py-5 font-medium">{name}</td>
                    <td className="text-center py-5">{marketShare}</td>
                    <td className="text-center py-5">${priceValue}</td>
                    <td className="text-center py-5">{satisfaction}</td>
                    <td className="text-center py-5">{innovation}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-5 text-gray-400">
                  No competitive positioning data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
