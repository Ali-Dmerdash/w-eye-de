"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
// Removed Redux hook import
import { RevenueAnalysis } from "@/state/type"; // Keep type import
// Removed LoadingSpinner import as parent handles loading

// Define props for AnalysisComponent
interface AnalysisComponentProps {
  analysisData: RevenueAnalysis | undefined | null;
}

export default function AnalysisComponent({
  analysisData,
}: AnalysisComponentProps) {
  // Removed Redux hook call
  // Removed local useState for analysisState, isLoading, error

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Loading and error handling will now be done in the parent component (page.tsx)

  if (!analysisData) {
    // Render a minimal state or rely on parent's handling.
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
  }

  return (
    <div className="flex items-start justify-center flex-wrap">
      <div className="w-full p-8 bg-[#4B65AB] dark:bg-[#1d2328] rounded-xl shadow-md">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bayon text-white">Revenue Analysis</h2>
        </div>
        <div className="flex flex-col items-center font-mulish text-gray-300">
          <p className="text-sm">{analysisData.insights}</p>
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
                  <h3 className="text-lg font-bayon text-white">
                    Model Recommendation
                  </h3>
                  <p className="mt-2 text-sm text-gray-300">
                    {analysisData.recommendation}
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
