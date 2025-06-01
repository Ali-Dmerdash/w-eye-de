"use client";

import TableSkeleton from "@/components/ui/tableSkeleton";
import React from "react"; // Removed useEffect, useState
import { useGetMarketDataQuery } from "@/state/api"; // Import the Redux hook
import {
  MarketModelResponse,
  CompetitivePositioning as CPType,
  PricingComparison as PCType,
} from "@/state/type"; // Import shared types

// Helper function to get a safe error message string
function getErrorMessage(error: unknown): string {
  if (!error) {
    return "An unknown error occurred";
  }
  if (typeof error === "object" && error !== null) {
    if ("status" in error) {
      // Handle RTK Query error structure
      let details = "";
      if (
        "data" in error &&
        typeof error.data === "object" &&
        error.data !== null &&
        "message" in error.data &&
        typeof error.data.message === "string"
      ) {
        details = error.data.message;
      } else if ("error" in error && typeof error.error === "string") {
        details = error.error;
      }
      return `Error ${error.status}${details ? ": " + details : ""}`;
    }
    if ("message" in error && typeof error.message === "string") {
      return error.message;
    }
  }
  // Fallback for other types of errors or if message is not a string
  try {
    return String(error);
  } catch {
    return "An unknown error occurred";
  }
}

export default function CompetitivePositioning() {
  // Fetch data using Redux Toolkit Query
  const {
    data: marketDataArray,
    isLoading,
    error: queryError,
  } = useGetMarketDataQuery();

  // Extract competitive positioning and pricing data from the first element
  const marketData: MarketModelResponse | undefined = marketDataArray?.[0];
  const competitivePositioningData: CPType | undefined | null =
    marketData?.competitive_positioning;
  const pricingComparisonData: PCType | undefined | null =
    marketData?.pricing_comparison;

  const scores: Record<string, (string | number)[]> | undefined =
    competitivePositioningData?.scores;
  const prices: Record<string, string> | undefined =
    pricingComparisonData?.competitors;

  // Determine if data is available (using derived data from hook)
  const hasScores = scores && Object.keys(scores).length > 0;
  const hasPrices = prices && Object.keys(prices).length > 0;

  // Use original JSX structure
  return (
    <div className="p-8 bg-[#4B65AB] dark:bg-[#1d2328] rounded-lg h-full flex flex-col shadow-inner-custom2">
      <div className="flex items-center justify-between mb-6">
        <div className="font-mulish">
          <h2 className="text-lg font-semibold text-white">
            Competitive Positioning
          </h2>
        </div>
      </div>

      {/* Original Loading State */}
      {isLoading ? (
        <TableSkeleton columns={5} />
      ) : /* Original Error State */
      queryError ? (
        <div className="text-xs text-center text-red-500">
          {getErrorMessage(queryError)}
        </div>
      ) : (
        /* Original Success/No Data State */
        <div className="overflow-x-auto flex-grow text-[0.6rem] text-left font-mulish">
          <table className="w-full text-white">
            <thead>
              <tr className="text-white/70 uppercase border-b-[1px] border-white/20 dark:border-[#56577A]">
                <th className="py-1">Name</th>
                <th className="text-center py-1">Market Share</th>
                <th className="text-center py-1">Price</th>
                <th className="text-center py-1">Satisfaction</th>
                <th className="text-center py-1">Innovation</th>
              </tr>
            </thead>
            <tbody className="text-white">
              {/* Use hasScores/hasPrices derived from hook data */}
              {hasScores && hasPrices ? (
                Object.entries(scores).map(([name, scoreArray]) => {
                  const priceString = prices[name];
                  const priceValue =
                    priceString?.match(/\d+(\.\d+)?/)?.[0] ?? "N/A";

                  const marketShare = scoreArray?.[1] ?? "N/A";
                  const satisfaction = scoreArray?.[2] ?? "N/A";
                  const innovation = scoreArray?.[3] ?? "N/A";

                  return (
                    <tr
                      key={name}
                      className="hover:bg-white/10 dark:hover:bg-gray-800/50 border-b-[1px] border-white/20 dark:border-[#56577A]"
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
                /* Original No Data Row */
                <tr>
                  <td colSpan={5} className="text-center py-5 text-gray-200">
                    No competitive positioning data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
