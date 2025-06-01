"use client";

import React, { useState } from "react"; // Removed useEffect
import Map from "@/assets/map.png";
import Image from "next/image";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { useGetMarketDataQuery } from "@/state/api"; // Import the Redux hook
import {
  MarketModelResponse,
  PricingComparison as PCType,
  CompetitivePositioning as CPType,
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

// Original LocationPin component
const LocationPin = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5 text-blue-500 mb-1"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
  </svg>
);

// Original competitorPositions constant
const competitorPositions: { [key: string]: { top: string; left: string } } = {
  APPLE: { top: "45%", left: "15%" },
  XIAOMI: { top: "30%", left: "65%" },
  SAMSUNG: { top: "70%", left: "48%" },
};

export default function MarketMap() {
  // Replace useState/useEffect with Redux hook
  const {
    data: marketDataArray,
    isLoading,
    error: queryError,
  } = useGetMarketDataQuery();

  // Keep original local state for UI interaction
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  // Extract data from the hook response
  const marketData: MarketModelResponse | undefined = marketDataArray?.[0];
  const pricingData: PCType | undefined | null = marketData?.pricing_comparison;
  const competitiveData: CPType | undefined | null =
    marketData?.competitive_positioning;

  const pricing: Record<string, string> | undefined = pricingData?.competitors;
  const scores: Record<string, (string | number)[]> | undefined =
    competitiveData?.scores;

  // Original logic to determine competitors and locations
  const competitors = [
    ...new Set([
      ...(pricing ? Object.keys(pricing) : []),
      ...(scores ? Object.keys(scores) : []),
    ]),
  ];

  const locations = competitors
    .map((name) => name.toUpperCase())
    .filter((name) => competitorPositions[name])
    .map((name) => ({
      name,
      ...competitorPositions[name],
    }));

  // Original logic to get data for the selected location modal
  const selectedData =
    selectedLocation && (pricing || scores)
      ? {
          price:
            pricing?.[selectedLocation] ||
            pricing?.[selectedLocation.toLowerCase()] ||
            "N/A",
          scores:
            scores?.[selectedLocation] ||
            scores?.[selectedLocation.toLowerCase()] ||
            [],
        }
      : null;

  // Original Loading State JSX
  if (isLoading) {
    return (
      <div className="bg-[#4B65AB] dark:bg-[#1d2328] rounded-xl h-[40vh] flex items-center justify-center text-white dark:text-white">
        <LoadingSpinner />
      </div>
    );
  }

  // Original Error State JSX
  if (queryError) {
    return (
      <div className="bg-[#4B65AB] dark:bg-[#1d2328] rounded-xl h-[40vh] flex items-center justify-center text-red-100 dark:text-red-400">
        Error: {getErrorMessage(queryError)}
      </div>
    );
  }

  // Original Success State JSX (including no locations check)
  return (
    <div className="bg-[#4B65AB] dark:bg-[#1d2328] rounded-xl h-[40vh] relative overflow-hidden hidden md:block shadow-inner-custom2">
      <Image src={Map} alt="Map" fill className="object-cover opacity-15 z-0" />

      {locations.length > 0 ? (
        locations.map((loc) => (
          <div
            key={loc.name}
            onClick={() => setSelectedLocation(loc.name)}
            className="absolute z-10 flex flex-col items-center cursor-pointer hover:scale-125 duration-300"
            style={{ top: loc.top, left: loc.left }}
          >
            <LocationPin />
            <span className="text-xs bg-white/20 dark:bg-white/20 text-white font-mulish px-2 py-0.5 rounded">
              {loc.name.charAt(0) + loc.name.slice(1).toLowerCase()}
            </span>
          </div>
        ))
      ) : (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <p className="text-gray-400">
            No competitor location data available.
          </p>
        </div>
      )}

      {selectedLocation && selectedData && (
        <div
          className="fixed inset-0 bg-black/30 dark:bg-black/80 flex items-center justify-center z-50"
          onClick={() => setSelectedLocation(null)}
        >
          <div
            className="bg-[#4B65AB] dark:bg-[#1d2328] rounded-lg p-6 w-96 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-200 hover:text-white dark:hover:text-white"
              onClick={() => setSelectedLocation(null)}
            >
              ✕
            </button>
            <h2 className="text-lg font-semibold mb-4 text-white dark:text-white">
              {selectedLocation.charAt(0) +
                selectedLocation.slice(1).toLowerCase()}{" "}
              Details
            </h2>
            <div className="text-sm text-white dark:text-gray-300 space-y-2 font-mulish">
              <p>
                <strong>Price:</strong> $
                {selectedData.price?.match(/\d+(\.\d+)?/)?.[0] ?? "N/A"}
              </p>
              {selectedData.scores?.length > 1 && (
                <p>
                  <strong>Market Share:</strong> {selectedData.scores[1]}
                </p>
              )}
              {selectedData.scores?.length > 2 && (
                <p>
                  <strong>Satisfaction:</strong> {selectedData.scores[2]}
                </p>
              )}
              {selectedData.scores?.length > 3 && (
                <p>
                  <strong>Innovation:</strong> {selectedData.scores[3]}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
