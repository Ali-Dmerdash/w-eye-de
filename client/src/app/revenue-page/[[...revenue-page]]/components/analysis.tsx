import React from "react"; // Import React
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useState, useEffect } from "react";

// Define an interface for the expected data structure
interface Analysis {
  insights: string;
  recommendation: string;
}

interface RevenueData {
  analysis: Analysis;
  // Add other top-level fields if needed
}

export default function AnalysisComponent() {
  // Renamed component assuming original name
  const [analysisState, setAnalysisState] = useState<Analysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Add React.FC type
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Add type for state

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          "http://localhost:3001/api/revenue/results"
        );        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const analysis = data?.trends?.[0]?.analysis;
        if (!analysis) throw new Error("Analysis data not found.");
        setAnalysisState(analysis);
      } catch (e: any) {
        console.error("Failed to fetch analysis data:", e);
        setError(e.message || "Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  if (isLoading)
    return (
      <div className="flex items-start justify-center flex-wrap">
        <div className="w-full bg-[#4B65AB] dark:bg-[#1d2328] text-white border-none rounded-xl p-8 shadow-md">
          <div className="text-center mb-6">
            <div className="h-6 w-48 bg-[#AEC3FF]/50 rounded mx-auto mb-4 pulse" />
          </div>
          <div className="space-y-3 mb-6">
            <div className="h-4 bg-[#AEC3FF]/50 rounded w-full pulse" />
            <div className="h-4 bg-[#AEC3FF]/50 rounded w-11/12 pulse" />
            <div className="h-4 bg-[#AEC3FF]/50 rounded w-10/12 pulse" />
          </div>
          <div className="mt-4 flex justify-center">
            <div className="h-10 w-36 bg-[#AEC3FF]/50 rounded pulse" />
          </div>
        </div>
      </div>
    );
  
  if (error)
    return (
      <div className="text-red-500 p-6 bg-[#4B65AB] dark:bg-[#1d2328] rounded-xl h-full flex items-center justify-center">
        Error: {error}
      </div>
    );
  if (!analysisState)
    return (
      <div className="text-white p-6 bg-[#4B65AB] dark:bg-[#1d2328] rounded-xl h-full flex items-center justify-center">
        No analysis data available.
      </div>
    );

  return (
    <div className="flex items-start justify-center flex-wrap">
      <div className="w-full p-8 bg-[#4B65AB] dark:bg-[#1d2328] rounded-xl shadow-md">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bayon text-white">Revenue Analysis</h2>
        </div>
        <div className="flex flex-col items-center font-mulish text-gray-300">
          <p className="text-sm">{analysisState.insights}</p>
          <div className="pt-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="block text-white hover:text-[#fafafa] dark:bg-gray-700 dark:hover:bg-gray-800 hover:bg-[#AEC3FF] bg-[#AEC3FF]/50 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Recommendation
            </button>
            {isModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-[#4B65AB] dark:bg-[#1d2328] border border-slate-500 dark:border-slate-800 rounded-xl p-6 max-w-md w-full shadow-lg">
                  <h3 className="text-lg font-bayon text-white">Model Recommendation</h3>
                  <p className="mt-2 text-sm text-gray-300">
                    {analysisState.recommendation}
                  </p>
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="block text-white dark:hover:text-[#484B6A] hover:text-[#fafafa] dark:bg-gray-700 dark:hover:bg-gray-800 bg-[#AEC3FF] hover:bg-[#AEC3FF]/50 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
