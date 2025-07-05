"use client"
import { useGetMarketDataQuery } from "@/state/api"
import type { MarketModelResponse, SwotAnalysis } from "@/state/type"
import { TrendingUp, AlertCircle, AlertTriangle } from "lucide-react"
import React from "react"
import Modal from "@/components/ui/Modal"
import { useUser } from "@clerk/nextjs"

// Helper function to get a safe error message string
function getErrorMessage(error: unknown): string {
  if (!error) {
    return "An unknown error occurred"
  }
  if (typeof error === "object" && error !== null) {
    if ("status" in error) {
      let details = ""
      if (
        "data" in error &&
        typeof error.data === "object" &&
        error.data !== null &&
        "message" in error.data &&
        typeof error.data.message === "string"
      ) {
        details = error.data.message
      } else if ("error" in error && typeof error.error === "string") {
        details = error.error
      }
      return `Error ${error.status}${details ? ": " + details : ""}`
    }
    if ("message" in error && typeof error.message === "string") {
      return error.message
    }
  }
  try {
    return String(error)
  } catch {
    return "An unknown error occurred"
  }
}

export default function Strengths() {
  const { data: marketDataArray, isLoading, error: queryError } = useGetMarketDataQuery()
  const { user, isLoaded } = useUser();
  const filesUploaded = user?.unsafeMetadata?.filesUploaded;

  const swotAnalysisData: SwotAnalysis | undefined | null = marketDataArray?.[0]?.swot_analysis
  const strengths = swotAnalysisData?.strengths || []

  // Modal state for table fields
  const [modalOpen, setModalOpen] = React.useState<{ field: string; items: string[] } | null>(null);

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-purple-100 dark:border-gray-700 p-6 h-full flex flex-col">
        <div className="animate-pulse">
          {/* Header skeleton */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 dark:bg-gray-700 rounded-lg"></div>
            <div>
              <div className="h-6 w-40 bg-purple-100 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-3 w-32 bg-purple-50 dark:bg-gray-600 rounded"></div>
            </div>
          </div>

          {/* Content skeleton */}
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-4 bg-purple-50 dark:bg-gray-700 rounded w-full"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Error/no-data state
  if (queryError || !swotAnalysisData) {
    const displayError = queryError ? getErrorMessage(queryError) : "SWOT analysis data unavailable"
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-red-200 dark:border-red-800 p-6 h-full flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 dark:text-red-400">Error: {displayError}</p>
        </div>
      </div>
    )
  }

  if (isLoaded && filesUploaded === false) {
    return (
      <div className="bg-white h-full dark:bg-gray-800 rounded-2xl shadow-lg border border-purple-100 dark:border-gray-700 p-6 flex flex-col items-center justify-center min-h-[200px]">
        <AlertTriangle className="w-8 h-8 text-yellow-500 mb-2" />
        <span className="text-gray-500 dark:text-gray-400 text-center font-medium">
          No data to display — file upload was bypassed.
        </span>
      </div>
    );
  }

  return (
    <>
      <div
        className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl shadow-lg border border-green-200 dark:border-green-800/30 p-6 h-full flex flex-col relative overflow-hidden cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300"
        onClick={() => strengths.length > 0 && setModalOpen({ field: 'All Strengths', items: strengths })}
        title={strengths.length > 0 ? "Click for more details" : undefined}
      >
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
          <div className="w-full h-full bg-green-300 rounded-full transform translate-x-6 -translate-y-6"></div>
        </div>

        {/* Header */}
        <div className="flex flex-col text-center items-center gap-3 mb-4 relative z-10">
          <div className="p-2.5 bg-green-100 dark:bg-green-900/50 rounded-xl shadow-sm">
            <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="font-bold text-green-800 dark:text-green-300 text-lg">Strengths</h3>
            <div className="flex items-center justify-center">
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Key Advantages</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-grow flex items-center justify-center relative z-10">
          {strengths.length > 0 ? (
            <div className="text-center">
              <div className="space-y-6">
                <p className="text-sm text-green-800 dark:text-green-200 leading-relaxed font-bold font-mulish px-2">{strengths[0]}</p>
                {strengths.length > 1 && (
                  <button
                    className="mt-4 text-xs text-green-700 dark:text-green-300 underline hover:text-green-900 dark:hover:text-green-100 font-medium focus:outline-none"
                    onClick={e => { e.stopPropagation(); setModalOpen({ field: 'All Strengths', items: strengths }) }}
                  >
                    Show More
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="bg-gray-100 dark:bg-gray-800/50 p-4 rounded-full">
                <TrendingUp className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 px-2">No strengths data available</p>
            </div>
          )}
        </div>

        {/* Footer Indicator */}
        {strengths.length > 0 && (
          <div className="mt-4 pt-3 border-t border-green-200 dark:border-green-800/30 relative z-10">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">High Potential</span>
            </div>
          </div>
        )}
      </div>
      {/* Modal for Table Fields */}
      <Modal open={!!modalOpen} onClose={() => setModalOpen(null)} title={modalOpen?.field}>
        {modalOpen && Array.isArray(modalOpen.items) && modalOpen.items.length > 0 ? (
          <ul className="list-disc pl-5 space-y-2">
            {modalOpen.items.map((item, idx) => (
              <li key={idx} className="text-sm text-green-900 dark:text-green-200">{item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No data available.</p>
        )}
      </Modal>
    </>
  )
}
