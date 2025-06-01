"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGetFraudDataQuery } from "@/state/api"; // Import the Redux hook
import { Analysis } from "@/state/type"; // Import the specific type needed

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

const ReportAmeen = () => {
  const [expanded, setExpanded] = useState(false);
  const { data: fraudDataArray, isLoading, error } = useGetFraudDataQuery();
  const analysisData: Analysis | undefined | null =
    fraudDataArray?.[0]?.analysis;

  // --- Loading State ---
  if (isLoading)
    return (
      <div className="flex items-start justify-center flex-wrap h-full">
        {/* Skeleton remains the same */}
        <div className="w-full max-w-md bg-[#4B65AB] dark:bg-[#1d2328] text-white border-none rounded-xl p-6 animate-pulse">
          <div className="text-center mb-4">
            <div className="h-5 w-32 dark:bg-gray-700/50 bg-gray-300/50 rounded mx-auto" />
          </div>
          <div className="space-y-3 mb-4">
            <div className="h-4 dark:bg-gray-700/50 bg-gray-300/50 rounded w-full" />
            <div className="h-4 dark:bg-gray-700/50 bg-gray-300/50 rounded w-11/12" />
            <div className="h-4 dark:bg-gray-700/50 bg-gray-300/50 rounded w-10/12" />
          </div>
          <div className="space-y-3">
            <div className="h-4 dark:bg-gray-700/50 bg-gray-300/50 rounded w-full" />
            <div className="h-4 dark:bg-gray-700/50 bg-gray-300/50 rounded w-11/12" />
          </div>
          <div className="mt-6 flex justify-center">
            <div className="h-9 w-32 dark:bg-gray-600/50 bg-gray-400/50 rounded" />
          </div>
        </div>
      </div>
    );

  // --- Error State ---
  if (error) {
    const errorMessage = getErrorMessage(error); // Use the helper function
    return (
      <div className="text-red-500 p-6 bg-[#4B65AB] dark:bg-[#1d2328] rounded-xl h-full flex items-center justify-center">
        Error: {errorMessage}
      </div>
    );
  }

  // --- No Data State ---
  if (!analysisData) {
    return (
      <div className="text-white p-6 bg-[#4B65AB] dark:bg-[#1d2328] rounded-xl h-full flex items-center justify-center">
        No analysis data available.
      </div>
    );
  }

  // --- Success State ---
  const causeText = analysisData.cause || "Cause information not available.";
  const recommendationText =
    analysisData.recommendation || "Recommendation not available.";
  const shortText = causeText;
  const fullText = `${causeText} <br /><br /> ${recommendationText}`;

  return (
    <div className="flex items-start justify-center flex-wrap h-full">
      {/* Card structure remains the same */}
      <Card className="w-full max-w-md bg-[#4B65AB] dark:bg-[#1d2328] text-white border-none rounded-xl flex flex-col h-full">
        <CardHeader className="text-center">
          <h2 className="text-lg font-semibold">Ameen Report</h2>
        </CardHeader>
        <CardContent className="flex-grow">
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
