"use client";
import TableSkeleton from "@/components/ui/TableSkeleton";
import { useState, useEffect } from "react";

// Define an interface for the expected data structure (optional but recommended)
interface FraudMetrics {
  incident_rate: string;
  common_patterns: { [key: string]: string };
}

interface FraudData {
  fraud_metrics: FraudMetrics;
  // Add other top-level fields from your data if needed
}

export default function FraudInc() {
  const [fraudDataState, setFraudDataState] = useState<FraudData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/fraud-data");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: FraudData = await response.json();
        setFraudDataState(data);
      } catch (e: any) {
        console.error("Failed to fetch fraud data:", e);
        setError(e.message || "Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this runs once on mount

  if (isLoading)
    return (
      <div className="bg-[#4B65AB] dark:bg-[#1d2328] text-white font-bayon p-6 rounded-xl h-full flex flex-col ">
        <div className="shadow-lg">
          <div className="bg-[#AEC3FF]/50 dark:bg-[#243461] shadow-inner-custom p-6 rounded-xl text-center mb-6">
            <div className="h-6 w-48 mx-auto bg-gray-300/50 rounded mb-4 pulse" />
            <div className="h-4 w-32 mx-auto bg-red-800 rounded pulse" />
          </div>
        </div>
  
        <div className="w-full border-t border-gray-700 mb-6"></div>
  
        <div className="flex-grow">
          <div className="h-6 w-60 bg-gray-300/50 rounded mb-6 pulse" />
          <ul className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <li
                key={i}
                className="flex items-center gap-4"
              >
                <div className="h-4 w-16 bg-gray-400/50 rounded pulse" />
                <div className="h-4 w-56 bg-gray-300/50 rounded pulse" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  
  if (error)
    return (
      <div className="text-red-500 p-6 bg-[#4B65AB] dark:bg-[#1d2328] rounded-xl h-full flex items-center justify-center">
        Error: {error}
      </div>
    );
  if (!fraudDataState)
    return (
      <div className="text-white p-6 bg-[#4B65AB] dark:bg-[#1d2328] rounded-xl h-full flex items-center justify-center">
        No data available.
      </div>
    );

  return (
    <div className="bg-[#4B65AB] dark:bg-[#1d2328] text-white font-bayon p-6 rounded-xl h-full flex flex-col">
      {/* Fraud Incidence Rate Box */}
      <div className="shadow-lg">
        <div className="bg-[#AEC3FF]/50 dark:bg-[#243461] shadow-inner-custom p-6 rounded-xl text-center mb-6">
          <h2 className="text-2xl tracking-wider text-white mb-2">
            FRAUD INCIDENCE RATE
          </h2>
          {/* Use data from state */}
          <p className="text-5xl text-red-600">
            {fraudDataState.fraud_metrics.incident_rate}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full border-t border-gray-700 mb-6"></div>

      {/* Common Fraudulent Patterns */}
      <div className="flex-grow">
        <h3 className="text-lg font-bold mb-4 font-mulish">
          COMMON FRAUDULENT PATTERNS
        </h3>
        <ul className="space-y-4">
          {/* Map over data from state */}
          {Object.entries(fraudDataState.fraud_metrics.common_patterns).map(
            ([pattern, percentage], index) => (
              <li key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl text-white">{percentage}</span>
                  <span className="text-gray-400 uppercase text-sm font-mulish">
                    {pattern.endsWith(".") ? pattern.slice(0, -1) : pattern}
                  </span>
                </div>
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  );
}
