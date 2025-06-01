"use client";

import React from "react"; // Removed useEffect, useState
import LoadingSpinner from "./../../../../components/ui/loadingSpinner";
import { useGetMarketDataQuery } from "@/state/api"; // Import the Redux hook
import { MarketModelResponse, SwotAnalysis } from "@/state/type"; // Import shared types

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

export default function Weaknesses() {
  // Replace useState/useEffect with Redux hook
  const {
    data: marketDataArray,
    isLoading,
    error: queryError,
  } = useGetMarketDataQuery();

  // Extract data from hook
  const marketData: MarketModelResponse | undefined = marketDataArray?.[0];
  const swotData: SwotAnalysis | undefined | null = marketData?.swot_analysis;
  const weaknesses: string[] | undefined = swotData?.weaknesses;

  // Original logic for derived state
  const hasWeaknesses = weaknesses && weaknesses.length > 0;
  const weaknessText = hasWeaknesses
    ? weaknesses[0].split(" (Source:")[0].trim()
    : "No weaknesses data available.";

  // Use original JSX structure
  return (
    <div className="bg-[#4B65AB] dark:bg-[#1d2328] text-white font-bayon p-6 rounded-lg h-full flex flex-col text-center justify-center items-center shadow-inner-custom2">
      <span className="text-3xl text-red-500 mb-2">Weaknesses</span>

      {/* Original Loading State */}
      {isLoading ? (
        <LoadingSpinner />
      ) : /* Original Error State */
      queryError ? (
        <span className="text-xs font-mulish text-red-400">
          {getErrorMessage(queryError)}
        </span>
      ) : /* Original Success/No Data State */
      hasWeaknesses ? (
        <div className="break-words leading-tight max-w-full">
          {/* Use weaknessText derived from hook data */}
          <span className="text-xs font-mulish">{weaknessText}</span>
        </div>
      ) : (
        /* Original No Data Text */
        <span className="text-xs font-mulish text-gray-400">
          {weaknessText}
        </span>
      )}
    </div>
  );
}
