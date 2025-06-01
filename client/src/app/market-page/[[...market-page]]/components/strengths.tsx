"use client";

import LoadingSpinner from "@/components/ui/loadingSpinner";
import React from "react"; // Removed useEffect, useState
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

export default function Strengths() {
  // Replace useState/useEffect with Redux hook
  const {
    data: marketDataArray,
    isLoading,
    error: queryError,
  } = useGetMarketDataQuery();

  // Extract data from hook
  const marketData: MarketModelResponse | undefined = marketDataArray?.[0];
  const swotData: SwotAnalysis | undefined | null = marketData?.swot_analysis;
  const strengths: string[] | undefined = swotData?.strengths;

  // Original logic for derived state
  const hasStrengths = strengths && strengths.length > 0;
  const strengthText = hasStrengths
    ? strengths[0].split(" (Source:")[0].trim()
    : "No strengths data available.";

  // Use original JSX structure
  return (
    <div className="bg-[#4B65AB] dark:bg-[#1d2328] text-white font-bayon p-6 rounded-lg h-full flex flex-col text-center justify-center items-center shadow-inner-custom2">
      <span className="text-3xl text-green-500 mb-2">Strengths</span>

      {/* Original Loading State */}
      {isLoading ? (
        <>
          <LoadingSpinner />
          {/* Original Error State */}
        </>
      ) : queryError ? (
        <span className="text-xs font-mulish text-red-400">
          {getErrorMessage(queryError)}
        </span>
      ) : /* Original Success/No Data State */
      hasStrengths ? (
        <div className="break-words leading-tight max-w-full">
          {/* Use strengthText derived from hook data */}
          <span className="text-xs font-mulish">{strengthText}</span>
        </div>
      ) : (
        /* Original No Data Text */
        <span className="text-xs font-mulish text-gray-400">
          {strengthText}
        </span>
      )}
    </div>
  );
}
