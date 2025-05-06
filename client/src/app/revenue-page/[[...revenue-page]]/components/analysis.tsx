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
        const response = await fetch("/api/revenue-data"); // Fetch from the new API route
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: RevenueData = await response.json();
        setAnalysisState(data.analysis);
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
        <div className="w-full bg-primary text-white border-none rounded-lg p-6">
          <div className="text-center mb-6">
            <div className="h-6 w-48 bg-gray-700 rounded mx-auto mb-4" />
          </div>
          <div className="space-y-3 mb-6">
            <div className="h-4 bg-gray-700 rounded w-full" />
            <div className="h-4 bg-gray-700 rounded w-11/12" />
            <div className="h-4 bg-gray-700 rounded w-10/12" />
          </div>
          <div className="mt-4 flex justify-center">
            <div className="h-10 w-36 bg-gray-600 rounded" />
          </div>
        </div>
      </div>
    );
  
  if (error)
    return (
      <div className="text-red-500 p-6 bg-primary rounded-lg h-full flex items-center justify-center">
        Error: {error}
      </div>
    );
  if (!analysisState)
    return (
      <div className="text-white p-6 bg-primary rounded-lg h-full flex items-center justify-center">
        No analysis data available.
      </div>
    );

  return (
    <div className="flex items-start justify-center flex-wrap">
      <Card className="w-full bg-primary text-white border-none">
        <CardHeader className="text-center">
          <h2 className="text-4xl font-bayon">Revenue Analysis</h2>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center font-mulish text-gray-400">
            <p className="text-sm">{analysisState.insights}</p>

            <div className="pt-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="block text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Recommendation
              </button>

              {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="bg-[#1D2328] rounded-lg p-6 max-w-md w-full shadow-lg dark:bg-gray-700">
                    <h3 className="text-lg font-semibold text-gray-200 dark:text-white">
                      Model Recommendation
                    </h3>
                    <p className="mt-2 text-sm text-gray-400 dark:text-gray-300">
                      {analysisState.recommendation}
                    </p>
                    <div className="flex justify-end mt-4">
                      <button
                        onClick={() => setIsModalOpen(false)}
                        className="block text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
