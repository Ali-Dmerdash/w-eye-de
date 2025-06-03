"use client"
import { useGetMarketDataQuery } from "@/state/api"
import type { MarketModelResponse, CompetitivePositioning as CPType, PricingComparison as PCType } from "@/state/type"
import { BarChart3, TrendingUp, AlertCircle } from "lucide-react"

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

  const marketData: MarketModelResponse | undefined = marketDataArray?.[0]
  const competitivePositioningData: CPType | undefined | null = marketData?.competitive_positioning
  const pricingComparisonData: PCType | undefined | null = marketData?.pricing_comparison

  const scores: Record<string, (string | number)[]> | undefined = competitivePositioningData?.scores
  const prices: Record<string, string> | undefined = pricingComparisonData?.competitors

  const hasScores = scores && Object.keys(scores).length > 0
  const hasPrices = prices && Object.keys(prices).length > 0

  // Loading State
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-purple-100 dark:border-gray-700 p-6 h-full flex flex-col">
        <div className="animate-pulse">
          {/* Header skeleton */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 dark:bg-gray-700 rounded-lg"></div>
            <div>
              <div className="h-5 w-48 bg-purple-100 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-3 w-32 bg-purple-50 dark:bg-gray-600 rounded"></div>
            </div>
          </div>

          {/* Table skeleton */}
          <div className="space-y-4">
            <div className="grid grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-4 bg-purple-100 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="grid grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <div key={j} className="h-4 bg-purple-50 dark:bg-gray-800 rounded"></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Error State
  if (queryError) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-red-200 dark:border-red-800 p-6 h-full flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 dark:text-red-400">Error: {getErrorMessage(queryError)}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-purple-100 dark:border-gray-700 p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
          <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Competitive Positioning</h2>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-green-500" />
            <span className="text-sm text-gray-500 dark:text-gray-400">Market performance analysis</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-grow overflow-hidden">
        <div className="overflow-x-auto h-full">
          <table className="w-full">
            <thead>
              <tr className="border-b border-purple-100 dark:border-gray-700">
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-600 dark:text-gray-300">Name</th>
                <th className="text-center py-3 px-2 text-sm font-medium text-gray-600 dark:text-gray-300">
                  Market Share
                </th>
                <th className="text-center py-3 px-2 text-sm font-medium text-gray-600 dark:text-gray-300">Price</th>
                <th className="text-center py-3 px-2 text-sm font-medium text-gray-600 dark:text-gray-300">
                  Satisfaction
                </th>
                <th className="text-center py-3 px-2 text-sm font-medium text-gray-600 dark:text-gray-300">
                  Innovation
                </th>
              </tr>
            </thead>
            <tbody>
              {hasScores && hasPrices ? (
                Object.entries(scores).map(([name, scoreArray], index) => {
                  const priceString = prices[name]
                  const priceValue = priceString?.match(/\d+(\.\d+)?/)?.[0] ?? "N/A"

                  const marketShare = scoreArray?.[1] ?? "N/A"
                  const satisfaction = scoreArray?.[2] ?? "N/A"
                  const innovation = scoreArray?.[3] ?? "N/A"

                  return (
                    <tr
                      key={name}
                      className="border-b border-purple-50 dark:border-gray-800 hover:bg-purple-25 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="py-4 px-2 font-medium text-gray-900 dark:text-white">{name}</td>
                      <td className="text-center py-4 px-2">
                        <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-full text-sm">
                          {marketShare}
                        </span>
                      </td>
                      <td className="text-center py-4 px-2">
                        <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full text-sm">
                          ${priceValue}
                        </span>
                      </td>
                      <td className="text-center py-4 px-2">
                        <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-2 py-1 rounded-full text-sm">
                          {satisfaction}
                        </span>
                      </td>
                      <td className="text-center py-4 px-2">
                        <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-2 py-1 rounded-full text-sm">
                          {innovation}
                        </span>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No competitive positioning data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
