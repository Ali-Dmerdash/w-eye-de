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
  // Add other fields as needed
}

interface AnalysisProps {
  marketData: MarketData | null; // Accept the market data as a prop
}

export default function Analysis({ marketData }: AnalysisProps) {
  // Handle cases where marketData might be null or missing expected fields
  if (!marketData || !marketData.market_analysis) {
    // Optionally return a loading state or an error message
    return (
      <div className="p-4 md:p-6 bg-[#1d2328] rounded-xl w-full h-[40vh] flex items-center justify-center text-white shadow-inner-custom2">
        Loading analysis data or data unavailable...
      </div>
    );
  }

  // Destructure the necessary data from the prop
  const { trends, market_share } = marketData.market_analysis;

  return (
    <div className="p-4 md:p-6 bg-[#1d2328] rounded-xl w-full h-[40vh] overflow-y-auto custom-scrollbar shadow-inner-custom2">
      <div className="">
        <h2 className="text-white text-xl md:text-2xl text-center font-bayon">
          MARKET ANALYSIS
        </h2>
      </div>

      <div className="pt-5 md:pt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="pr-1">
            <h3 className="text-white text-base mb-2 text-center font-mulish">
              Trends
            </h3>
            <table className="w-full text-xs font-mulish text-white">
              <thead>
                <tr className="text-gray-400 text-left border-b-[1px] border-[#56577A]">
                  <th className="py-3">Name</th>
                  <th className="py-3 text-center">Growth</th>
                  <th className="py-3 text-center">Impact</th>
                </tr>
              </thead>
              <tbody>
                {/* Check if trends exist before mapping */}
                {trends && trends.length > 0 ? (
                  trends.map((trend, index) => (
                    <tr
                      key={index}
                      className="border-b-[1px] border-[#56577A] hover:bg-gray-800/50"
                    >
                      <td className="py-5">{trend.name}</td>
                      <td className="py-5 text-center">
                        {/* Use optional chaining and nullish coalescing for safety */}
                        {trend.growth?.match(/\d+/)?.[0] ?? "N/A"}%
                      </td>
                      <td className="py-5 text-center capitalize">
                        {trend.impact}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center py-5 text-gray-400">
                      No trend data available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="md:pl-3 md:border-l md:border-gray-700 pt-5 md:pt-0">
            <h3 className="text-white text-base mb-2 text-center font-mulish">
              Market Share
            </h3>
            <table className="w-full text-xs font-mulish text-white">
              <thead>
                <tr className="text-gray-400 text-left border-b-[1px] border-[#56577A]">
                  <th className="py-3">Name</th>
                  <th className="py-3 pe-2 text-end">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {/* Check if market_share exists and has entries before mapping */}
                {market_share && Object.keys(market_share).length > 0 ? (
                  Object.entries(market_share).map(
                    ([name, percentage], index) => (
                      <tr
                        key={index}
                        className="border-b-[1px] border-[#56577A] hover:bg-gray-800/50"
                      >
                        <td className="py-3.5">{name}</td>
                        <td className="py-3.5 pe-2 text-end">
                          {/* Use optional chaining and nullish coalescing for safety */}
                          {percentage?.match(/\d+/)?.[0] ?? "N/A"}%
                        </td>
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td colSpan={2} className="text-center py-5 text-gray-400">
                      No market share data available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
