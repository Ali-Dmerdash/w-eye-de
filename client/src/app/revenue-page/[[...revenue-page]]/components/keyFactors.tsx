"use client";
import { useState, useEffect } from "react";

// Define an interface for the expected data structure
interface KeyFactors {
  [key: string]: string; // e.g., "Seasonal Demand": "0.3/High"
}

interface RevenueData {
  key_factors: KeyFactors;
  // Add other top-level fields if needed
}

export default function KeyFactorsComponent() {
  // Renamed component assuming original name
  const [keyFactorsState, setKeyFactorsState] = useState<KeyFactors | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/revenue-data"); // Fetch from the new API route
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: RevenueData = await response.json();
        setKeyFactorsState(data.key_factors);
      } catch (e: any) {
        console.error("Failed to fetch key factors data:", e);
        setError(e.message || "Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading)
    return (
      <div className="text-white p-6 bg-[#1d2328] rounded-lg h-full flex items-center justify-center">
        Loading Key Factors...
      </div>
    );
  if (error)
    return (
      <div className="text-red-500 p-6 bg-[#1d2328] rounded-lg h-full flex items-center justify-center">
        Error: {error}
      </div>
    );
  if (!keyFactorsState)
    return (
      <div className="text-white p-6 bg-[#1d2328] rounded-lg h-full flex items-center justify-center">
        No key factors data available.
      </div>
    );

  return (
    <div className="bg-[#1d2328] text-white p-6 rounded-lg h-full flex flex-col">
      <h3 className="text-lg font-semibold mb-4">Key Revenue Factors</h3>
      <ul className="space-y-3 flex-grow">
        {Object.entries(keyFactorsState).map(([factor, value], index) => {
          const [score, level] = value.split("/"); // Split value like "0.3/High"
          return (
            <li key={index} className="flex justify-between items-center">
              <span>{factor}</span>
              <span
                className={`text-sm px-2 py-0.5 rounded ${
                  level?.toLowerCase() === "high"
                    ? "bg-green-500/20 text-green-300"
                    : level?.toLowerCase() === "medium"
                    ? "bg-yellow-500/20 text-yellow-300"
                    : "bg-gray-500/20 text-gray-300"
                }`}
              >
                {level} ({score})
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
