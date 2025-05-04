"use client";

import React from "react";

// Define the interface for the market data prop (should match the one in page.tsx)
// Ensure this interface accurately reflects your MongoDB data structure
interface MarketData {
  _id: string;
  swot_analysis?: { [key: string]: any }; // Optional other fields
  pricing_comparison: {
    competitors: { [key: string]: string }; // e.g., { "Xiaomi": "599 (Source...)" }
    discount_strategies: string[]; // e.g., ["Price matching", "(Source...)"]
  };
  competitive_positioning?: { [key: string]: any };
  market_analysis?: { [key: string]: any };
  recommendations?: { [key: string]: any };
  // Add other fields as needed
}

interface PricingComparisonProps {
  marketData: MarketData | null; // Accept the market data as a prop
}

export default function PricingComparison({
  marketData,
}: PricingComparisonProps) {
  // Handle cases where marketData or pricing_comparison might be null/missing
  if (!marketData || !marketData.pricing_comparison) {
    return (
      <div className="p-8 bg-[#1d2328] rounded-lg h-full flex flex-col justify-center items-center text-white shadow-inner-custom2">
        Loading pricing comparison data or data unavailable...
      </div>
    );
  }

  // Destructure the necessary data from the prop
  const { competitors, discount_strategies } = marketData.pricing_comparison;

  // Check if competitors object exists and has entries
  const hasCompetitors = competitors && Object.keys(competitors).length > 0;
  const competitorCount = hasCompetitors ? Object.keys(competitors).length : 0;
  // Get the first discount strategy, handle if array is empty or missing
  const firstDiscountStrategy =
    discount_strategies && discount_strategies.length > 0
      ? discount_strategies[0]
      : "N/A";

  return (
    <div className="p-8 bg-[#1d2328] rounded-lg h-full flex flex-col shadow-inner-custom2">
      <div className="flex items-center justify-between mb-6">
        <div className="font-mulish">
          <h2 className="text-lg font-semibold text-white">
            Pricing Comparison
          </h2>
          <p className="text-sm text-emerald-500">
            {competitorCount} Competitor
            {competitorCount !== 1 ? "s are" : " is"} available
          </p>
        </div>
        {/* Optional: Keep or remove the ellipsis button */}
        <button className="p-2 text-gray-400 rounded-lg hover:bg-gray-800">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>

      <div className="overflow-x-auto flex-grow text-xs text-left font-mulish">
        <table className="w-full">
          <thead>
            <tr className="text-xs text-gray-400 uppercase border-b-[1px] border-[#56577A]">
              <th className="py-3">Name</th>
              <th className="text-center py-3">Price</th>
              <th className="text-center py-3">Discount Strategies</th>
            </tr>
          </thead>
          <tbody className="text-white">
            {hasCompetitors ? (
              Object.entries(competitors).map(([name, priceString]) => {
                // Safely extract price value
                const priceValue = priceString?.match(/\d+/)?.[0] ?? "N/A";

                return (
                  <tr
                    key={name}
                    className="hover:bg-gray-800/50 border-b-[1px] border-[#56577A]"
                  >
                    <td className="py-5 font-medium">{name}</td>
                    <td className="text-center py-5">${priceValue}</td>
                    <td className="text-center py-5">
                      {/* Display the first discount strategy for all competitors, or modify if needed */}
                      {firstDiscountStrategy}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={3} className="text-center py-5 text-gray-400">
                  No pricing comparison data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
