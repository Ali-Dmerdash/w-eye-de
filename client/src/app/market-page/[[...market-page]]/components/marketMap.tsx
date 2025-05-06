"use client";

import React, { useState } from "react";
import Map from "@/assets/map.png"; // Assuming the map asset path is correct relative to this component
import Image from "next/image";

// Define the interface for the market data prop (should match the one in page.tsx)
interface MarketData {
  _id: string;
  // Include other fields as needed, especially those relevant to the map/modal
  pricing_comparison?: {
    competitors: { [key: string]: string };
  };
  competitive_positioning?: {
    scores: { [key: string]: string[] };
  };
  // Add other fields from your MongoDB document as needed
}

interface MarketMapProps {
  marketData: MarketData | null; // Accept the market data as a prop
}

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

// Define static positions for known competitors.
// Ideally, this positioning data might also come from the backend/CMS in the future.
const competitorPositions: { [key: string]: { top: string; left: string } } = {
  APPLE: { top: "45%", left: "15%" },
  XIAOMI: { top: "30%", left: "65%" },
  SAMSUNG: { top: "70%", left: "48%" },
  // Add positions for other potential competitors if needed
};

export default function MarketMap({ marketData }: MarketMapProps) {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  // Determine locations to display based on competitors in marketData
  // Use competitors from pricing_comparison or competitive_positioning
  const competitors = marketData?.pricing_comparison?.competitors
    ? Object.keys(marketData.pricing_comparison.competitors)
    : marketData?.competitive_positioning?.scores
    ? Object.keys(marketData.competitive_positioning.scores)
    : [];

  const locations = competitors
    .map((name) => name.toUpperCase()) // Normalize name to uppercase for matching
    .filter((upperName) => competitorPositions[upperName]) // Only include competitors with defined positions
    .map((upperName) => ({
      name: upperName, // Keep uppercase or use original name if needed
      ...competitorPositions[upperName],
    }));

  // Get details for the selected competitor for the modal
  const selectedCompetitorData =
    selectedLocation && marketData
      ? {
          price:
            marketData.pricing_comparison?.competitors?.[selectedLocation] ||
            marketData.pricing_comparison?.competitors?.[
              selectedLocation.toLowerCase()
            ] ||
            "N/A",
          scores:
            marketData.competitive_positioning?.scores?.[selectedLocation] ||
            marketData.competitive_positioning?.scores?.[
              selectedLocation.toLowerCase()
            ] ||
            [],
        }
      : null;

  return (
    <div className="bg-[#1d2328] rounded-xl h-[40vh] relative overflow-hidden hidden md:block shadow-inner-custom2">
      <Image src={Map} alt="Map" fill className="object-cover opacity-15 z-0" />

      {locations.length > 0 ? (
        locations.map((loc) => (
          <div
            key={loc.name}
            onClick={() => setSelectedLocation(loc.name)} // Use the name used in the data (e.g., APPLE)
            className="absolute z-10 flex flex-col items-center cursor-pointer hover:scale-125 duration-300"
            style={{ top: loc.top, left: loc.left }}
          >
            <LocationPin />
            <span className="text-xs bg-white/20 text-white font-mulish px-2 py-0.5 rounded">
              {/* Display name consistently, e.g., capitalize */}
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

      {selectedLocation && selectedCompetitorData && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setSelectedLocation(null)}
        >
          {/* Added background click to close */}
          <div
            className="bg-[#1d2328] rounded-lg p-6 w-96 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Prevent modal close on content click */}
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
              onClick={() => setSelectedLocation(null)}
            >
              ✕
            </button>
            <h2 className="text-lg font-semibold mb-4 text-white">
              {selectedLocation.charAt(0) +
                selectedLocation.slice(1).toLowerCase()}{" "}
              Details
            </h2>
            <div className="text-sm text-gray-300 space-y-2 font-mulish">
              <p>
                <strong>Price:</strong> $
                {selectedCompetitorData.price?.match(/\d+/)?.[0] ?? "N/A"}
              </p>
              {/* Display scores if available */}
              {selectedCompetitorData.scores.length > 1 && (
                <p>
                  <strong>Market Share:</strong>{" "}
                  {selectedCompetitorData.scores[1] ?? "N/A"}
                </p>
              )}
              {selectedCompetitorData.scores.length > 2 && (
                <p>
                  <strong>Satisfaction:</strong>{" "}
                  {selectedCompetitorData.scores[2] ?? "N/A"}
                </p>
              )}
              {selectedCompetitorData.scores.length > 3 && (
                <p>
                  <strong>Innovation:</strong>{" "}
                  {selectedCompetitorData.scores[3] ?? "N/A"}
                </p>
              )}
              {/* Add more details from marketData as needed */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
