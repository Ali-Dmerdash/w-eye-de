"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Assuming similar imports

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
      <div className="text-white p-6 bg-primary rounded-lg h-full flex items-center justify-center">
        Loading Analysis...
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
    <Card className="w-full bg-primary text-white border-none h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Revenue Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col space-y-4">
        <div>
          <h4 className="text-md font-medium mb-1">Insights:</h4>
          <p className="text-sm text-gray-300">{analysisState.insights}</p>
        </div>
        <div>
          <h4 className="text-md font-medium mb-1">Recommendation:</h4>
          <p className="text-sm text-gray-300">
            {analysisState.recommendation}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
