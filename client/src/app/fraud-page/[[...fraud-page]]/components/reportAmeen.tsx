"use client";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Define an interface for the expected data structure
interface Analysis {
  cause: string;
  recommendation: string;
}

interface FraudData {
  analysis: Analysis;
  // Add other top-level fields if needed
}

const ReportAmeen = () => {
  const [expanded, setExpanded] = useState(false);
  const [analysisData, setAnalysisData] = useState<Analysis | null>(null);
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
        setAnalysisData(data.analysis);
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
        Loading Report...
      </div>
    );
  if (error)
    return (
      <div className="text-red-500 p-6 bg-primary rounded-lg h-full flex items-center justify-center">
        Error: {error}
      </div>
    );
  if (!analysisData)
    return (
      <div className="text-white p-6 bg-primary rounded-lg h-full flex items-center justify-center">
        No analysis data available.
      </div>
    );

  // Short and full text based on the fetched analysis data
  const shortText = `${analysisData.cause}`;
  const fullText = `${analysisData.cause} <br /> ${analysisData.recommendation}`;

  return (
    <div className="flex items-start justify-center flex-wrap ">
      <Card className="w-full max-w-md bg-primary text-white border-none">
        <CardHeader className="text-center">
          <h2 className="text-lg font-semibold">Ameen Report</h2>
        </CardHeader>
        <CardContent>
          <p
            className="text-sm"
            dangerouslySetInnerHTML={{
              __html: expanded ? fullText : shortText,
            }}
          />
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            onClick={() => setExpanded(!expanded)}
            className="bg-accent hover:bg-blue-700 text-white"
          >
            {expanded ? "Read Less" : "Generate more"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
export default ReportAmeen;
