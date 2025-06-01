"use client";

import TableSkeleton from "@/components/ui/tableSkeleton";
import React from "react"; // Removed useEffect, useState
import { useGetMarketDataQuery } from "@/state/api"; // Import the Redux hook
import { MarketAnalysis, MarketModelResponse } from "@/state/type"; // Import shared types

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

export default function Analysis() {
  // Replace useState/useEffect with Redux hook
  const {
    data: marketDataArray,
    isLoading,
    error: queryError,
  } = useGetMarketDataQuery();

  // Extract data
  const marketAnalysisData: MarketAnalysis | undefined | null =
    marketDataArray?.[0]?.market_analysis;

  // Original loading state structure
  if (isLoading) {
    return (
      <div className="p-4 md:p-6 bg-[#4B65AB] dark:bg-[#1d2328] rounded-xl w-full h-[40vh] overflow-y-auto custom-scrollbar shadow-inner-custom2">
        <h2 className="text-white dark:text-white text-xl md:text-2xl text-center font-bayon mb-5">
          MARKET ANALYSIS
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="pr-1">
            <h3 className="text-white dark:text-white text-base mb-2 text-center font-mulish">
              Trends
            </h3>
            <TableSkeleton columns={3} rows={3} />
          </div>
          <div className="md:pl-3 md:border-l border-white/20 dark:border-gray-700 pt-5 md:pt-0">
            <h3 className="text-white dark:text-white text-base mb-2 text-center font-mulish">
              Market Share
            </h3>
            <TableSkeleton columns={2} rows={3} />
          </div>
        </div>
      </div>
    );
  }

  // Original error/no-data state structure
  if (queryError || !marketAnalysisData) {
    const displayError = queryError
      ? getErrorMessage(queryError)
      : "Market analysis data unavailable";
    return (
      <div className="p-4 md:p-6 bg-[#4B65AB] dark:bg-[#1d2328] rounded-xl w-full h-[40vh] flex items-center justify-center text-red-100 dark:text-red-400 shadow-inner-custom2">
        Error: {displayError}
      </div>
    );
  }

  // Original success state structure
  const { trends, market_share } = marketAnalysisData;

  return (
    <div className="p-4 md:p-6 bg-[#4B65AB] dark:bg-[#1d2328] rounded-xl w-full h-[40vh] overflow-y-auto custom-scrollbar shadow-inner-custom2">
      <div>
        <h2 className="text-white dark:text-white text-xl md:text-2xl text-center font-bayon">
          MARKET ANALYSIS
        </h2>
      </div>

      <div className="pt-5 md:pt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="pr-1">
            <h3 className="text-white dark:text-white text-base mb-2 text-center font-mulish">
              Trends
            </h3>
            <table className="w-full text-xs font-mulish text-white dark:text-white">
              <thead>
                <tr className="text-white/70 dark:text-gray-400 text-left border-b-[1px] border-white/20 dark:border-[#56577A]">
                  <th className="py-3">Name</th>
                  <th className="py-3 text-center">Growth</th>
                  <th className="py-3 text-center">Impact</th>
                </tr>
              </thead>
              <tbody>
                {trends?.length > 0 ? (
                  trends.map((trend, index) => (
                    <tr
                      key={index}
                      className="border-b-[1px] border-white/20 dark:border-[#56577A] hover:bg-white/10 dark:hover:bg-gray-800/50"
                    >
                      <td className="py-5">{trend.name}</td>
                      <td className="py-5 text-center">
                        {trend.growth?.match(/\d+(\.\d+)?/)?.[0] ?? "N/A"}%
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

          <div className="md:pl-3 md:border-l border-white/20 dark:border-gray-700 pt-5 md:pt-0">
            <h3 className="text-white dark:text-white text-base mb-2 text-center font-mulish">
              Market Share
            </h3>
            <table className="w-full text-xs font-mulish text-white dark:text-white">
              <thead>
                <tr className="text-white/70 dark:text-gray-400 text-left border-b-[1px] border-white/20 dark:border-[#56577A]">
                  <th className="py-3">Name</th>
                  <th className="py-3 pe-2 text-end">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {market_share && Object.keys(market_share).length > 0 ? (
                  Object.entries(market_share).map(
                    ([name, percentage], index) => (
                      <tr
                        key={index}
                        className="border-b-[1px] border-white/20 dark:border-[#56577A] hover:bg-white/10 dark:hover:bg-gray-800/50"
                      >
                        <td className="py-3.5">{name}</td>
                        <td className="py-3.5 pe-2 text-end">
                          {percentage?.match(/\d+(\.\d+)?/)?.[0] ?? "N/A"}%
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
