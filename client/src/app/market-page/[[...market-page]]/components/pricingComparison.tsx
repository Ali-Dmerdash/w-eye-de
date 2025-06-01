"use client";
import TableSkeleton from "@/components/ui/tableSkeleton";
import React from "react"; // Removed useEffect, useState
import { useGetMarketDataQuery } from "@/state/api"; // Import the Redux hook
import { MarketModelResponse, PricingComparison as PCType } from "@/state/type"; // Import shared types

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

export default function PricingComparison() {
  // Replace useState/useEffect with Redux hook
  const {
    data: marketDataArray,
    isLoading,
    error: queryError,
  } = useGetMarketDataQuery();

  // Extract data from hook
  const marketData: MarketModelResponse | undefined = marketDataArray?.[0];
  const pricingComparisonData: PCType | undefined | null =
    marketData?.pricing_comparison;

  const competitors: Record<string, string> | undefined =
    pricingComparisonData?.competitors;
  const discountStrategies: string[] | undefined =
    pricingComparisonData?.discount_strategies;

  // Original logic for derived state
  const hasCompetitors = competitors && Object.keys(competitors).length > 0;
  const firstDiscountStrategy =
    discountStrategies?.[0]?.split(" (Source:")[0].trim() || "N/A"; // Extract text before source

  // Use original JSX structure
  return (
    <div className="p-8 bg-[#4B65AB] dark:bg-[#1d2328] rounded-lg h-full flex flex-col shadow-inner-custom2">
      {/* Original Title Section */}
      <div className="flex items-center justify-between mb-6">
        <div className="font-mulish">
          <h2 className="text-lg font-semibold text-white">
            Pricing Comparison
          </h2>
          {/* Conditional rendering based on loading/error/data */}
          <p
            className={`text-sm ${
              isLoading
                ? "text-gray-400 animate-pulse"
                : queryError
                ? "text-red-400"
                : hasCompetitors
                ? "text-emerald-300"
                : "text-gray-400"
            }`}
          >
            {isLoading
              ? "Loading data..."
              : queryError
              ? "Error loading data"
              : hasCompetitors
              ? `${Object.keys(competitors).length} Competitor${
                  Object.keys(competitors).length !== 1 ? "s are" : " is"
                } available`
              : "No competitors available"}
          </p>
        </div>
      </div>

      {/* Original Loading State */}
      {isLoading ? (
        <TableSkeleton columns={3} />
      ) : /* Original Error State */
      queryError ? (
        <div className="text-xs text-center text-red-400 flex-grow flex items-center justify-center">
          {getErrorMessage(queryError)}
        </div>
      ) : (
        /* Original Success/No Data State */
        <div className="overflow-x-auto flex-grow text-xs text-left font-mulish">
          <table className="w-full text-white">
            <thead>
              <tr className="text-xs text-white/70 uppercase border-b-[1px] border-white/20 dark:border-[#56577A]">
                <th className="py-3">Name</th>
                <th className="text-center py-3">Price</th>
                <th className="text-center py-3">Discount Strategies</th>
              </tr>
            </thead>
            <tbody className="text-white">
              {/* Use hasCompetitors derived from hook data */}
              {hasCompetitors ? (
                Object.entries(competitors).map(([name, priceString]) => {
                  const priceValue =
                    priceString?.match(/\d+(\.\d+)?/)?.[0] ?? "N/A";
                  return (
                    <tr
                      key={name}
                      className="hover:bg-white/10 dark:hover:bg-gray-800/50 border-b-[1px] border-white/20 dark:border-[#56577A]"
                    >
                      <td className="py-5 font-medium">{name}</td>
                      <td className="text-center py-5">${priceValue}</td>
                      <td className="text-center py-5">
                        {/* Use firstDiscountStrategy derived from hook data */}
                        {firstDiscountStrategy}
                      </td>
                    </tr>
                  );
                })
              ) : (
                /* Original No Data Row */
                <tr>
                  <td colSpan={3} className="text-center py-5 text-gray-200">
                    No pricing comparison data available.
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
