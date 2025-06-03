"use client"
import { useGetMarketDataQuery } from "@/state/api"
import type { MarketAnalysis } from "@/state/type"
import { BarChart3, TrendingUp, PieChart, AlertCircle } from "lucide-react"

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

export default function Analysis() {
  const { data: marketDataArray, isLoading, error: queryError } = useGetMarketDataQuery()

  const marketAnalysisData: MarketAnalysis | undefined | null = marketDataArray?.[0]?.market_analysis

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
  if (queryError || !marketAnalysisData) {
    const displayError = queryError ? getErrorMessage(queryError) : "Market analysis data unavailable"
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-red-200 dark:border-red-800 p-6 h-full flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 dark:text-red-400">Error: {displayError}</p>
        </div>
      </div>
    )
  }

  const { trends, market_share } = marketAnalysisData

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-purple-100 dark:border-gray-700 p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
          <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Market Analysis</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Trends and market share insights</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
          {/* Trends Section */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <h3 className="font-medium text-gray-900 dark:text-white">Market Trends</h3>
            </div>
            <div className="flex-grow overflow-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-purple-100 dark:border-gray-700">
                    <th className="text-left py-2 text-sm font-medium text-gray-600 dark:text-gray-300">Name</th>
                    <th className="text-center py-2 text-sm font-medium text-gray-600 dark:text-gray-300">Growth</th>
                    <th className="text-center py-2 text-sm font-medium text-gray-600 dark:text-gray-300">Impact</th>
                  </tr>
                </thead>
                <tbody>
                  {trends?.length > 0 ? (
                    trends.map((trend, index) => (
                      <tr
                        key={index}
                        className="border-b border-purple-50 dark:border-gray-800 hover:bg-purple-25 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <td className="py-3 text-sm text-gray-900 dark:text-white">{trend.name}</td>
                        <td className="text-center py-3">
                          <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full text-xs">
                            {trend.growth?.match(/\d+(\.\d+)?/)?.[0] ?? "N/A"}%
                          </span>
                        </td>
                        <td className="text-center py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs capitalize ${
                              trend.impact === "high"
                                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                : trend.impact === "medium"
                                  ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                  : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                            }`}
                          >
                            {trend.impact}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="text-center py-6 text-gray-500 dark:text-gray-400">
                        No trend data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Market Share Section */}
          <div className="flex flex-col md:border-l md:border-purple-100 md:dark:border-gray-700 md:pl-6">
            <div className="flex items-center gap-2 mb-4">
              <PieChart className="w-5 h-5 text-purple-500" />
              <h3 className="font-medium text-gray-900 dark:text-white">Market Share</h3>
            </div>
            <div className="flex-grow overflow-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-purple-100 dark:border-gray-700">
                    <th className="text-left py-2 text-sm font-medium text-gray-600 dark:text-gray-300">Company</th>
                    <th className="text-right py-2 text-sm font-medium text-gray-600 dark:text-gray-300">Share</th>
                  </tr>
                </thead>
                <tbody>
                  {market_share && Object.keys(market_share).length > 0 ? (
                    Object.entries(market_share).map(([name, percentage], index) => (
                      <tr
                        key={index}
                        className="border-b border-purple-50 dark:border-gray-800 hover:bg-purple-25 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <td className="py-3 text-sm text-gray-900 dark:text-white">{name}</td>
                        <td className="text-right py-3">
                          <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-2 py-1 rounded-full text-xs font-medium">
                            {percentage?.match(/\d+(\.\d+)?/)?.[0] ?? "N/A"}%
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2} className="text-center py-6 text-gray-500 dark:text-gray-400">
                        No market share data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
