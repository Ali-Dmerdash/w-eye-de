"use client"
import { useGetMarketDataQuery } from "@/state/api"
import type { MarketModelResponse, CompetitivePositioning as CPType, PricingComparison as PCType } from "@/state/type"
import { BarChart3, TrendingUp, AlertCircle, AlertTriangle } from "lucide-react"
import { useEffect } from "react"
import Modal from "@/components/ui/Modal"
import React from "react"
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

export default function CompetitivePositioning() {
  const { data: marketDataArray, isLoading, error: queryError } = useGetMarketDataQuery()
  const { user, isLoaded } = useUser();
  const filesUploaded = user?.unsafeMetadata?.filesUploaded;
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

  const marketData: CPType | undefined | null = marketDataArray?.[0]?.competitive_positioning

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="h-5 w-20 bg-purple-100 dark:bg-gray-700 rounded mb-4"></div>
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="grid grid-cols-3 gap-4">
                    <div className="h-4 bg-purple-50 dark:bg-gray-800 rounded"></div>
                    <div className="h-4 bg-purple-50 dark:bg-gray-800 rounded"></div>
                    <div className="h-4 bg-purple-50 dark:bg-gray-800 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="h-5 w-28 bg-purple-100 dark:bg-gray-700 rounded mb-4"></div>
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="grid grid-cols-2 gap-4">
                    <div className="h-4 bg-purple-50 dark:bg-gray-800 rounded"></div>
                    <div className="h-4 bg-purple-50 dark:bg-gray-800 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error/no-data state
  if (queryError || !marketData) {
    const displayError = queryError ? getErrorMessage(queryError) : "Competitive positioning data unavailable"
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-red-200 dark:border-red-800 p-6 h-full flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 dark:text-red-400">Error: {displayError}</p>
        </div>
      </div>
    )
  }

  const { market_share = '', key_differentiators = [], customer_segments = [] } = marketData;

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-purple-100 dark:border-gray-700 p-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Competitive Positioning</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Market share and differentiation</p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
            {/* Table Section */}
            <div className="flex flex-col col-span-2">
              <div className="flex-grow overflow-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-purple-100 dark:border-gray-700">
                      <th className="text-left py-2 text-sm font-medium text-gray-600 dark:text-gray-300">Market Share</th>
                      <th className="text-center py-2 text-sm font-medium text-gray-600 dark:text-gray-300">Key Differentiators</th>
                      <th className="text-center py-2 text-sm font-medium text-gray-600 dark:text-gray-300">Customer Segments</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-purple-50 dark:border-gray-800 hover:bg-purple-25 dark:hover:bg-gray-700/50 transition-colors">
                      {/* Market Share */}
                      <td className="py-3 text-sm text-gray-900 dark:text-white">
                        <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-full text-xs font-medium">
                          {market_share}
                        </span>
                      </td>
                      {/* Key Differentiators */}
                      <td className="text-center py-3 text-sm text-gray-900 dark:text-white">
                        <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full text-xs font-medium">                        
                        {key_differentiators.length === 1 ? key_differentiators[0] : (
                          <button
                            className="text-xs text-green-700 dark:text-green-300 underline hover:text-green-900 dark:hover:text-green-100 font-medium focus:outline-none"
                            onClick={() => setModalOpen({ field: 'All Key Differentiators', items: key_differentiators })}
                          >
                            Show All
                          </button>
                        )}</span>
                      </td>
                      {/* Customer Segments */}
                      <td className="text-center py-3 text-sm text-gray-900 dark:text-white">
                        <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-2 py-1 rounded-full text-xs font-medium">
                        {customer_segments.length === 1 ? customer_segments[0] : (
                          <button
                            className="text-xs text-purple-700 dark:text-purple-300 underline hover:text-purple-900 dark:hover:text-purple-100 font-medium focus:outline-none"
                            onClick={() => setModalOpen({ field: 'All Customer Segments', items: customer_segments })}
                          >
                            Show All
                          </button>
                        )}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modal for Table Fields */}
      <Modal open={!!modalOpen} onClose={() => setModalOpen(null)} title={modalOpen?.field}>
        {modalOpen && Array.isArray(modalOpen.items) && modalOpen.items.length > 0 ? (
          <ul className="list-disc pl-5 space-y-2">
            {modalOpen.items.map((item, idx) => (
              <li key={idx} className="text-sm text-gray-900 dark:text-gray-200">{item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No data available.</p>
        )}
      </Modal>
    </>
  )
}
