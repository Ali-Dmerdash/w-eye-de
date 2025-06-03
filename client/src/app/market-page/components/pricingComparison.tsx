"use client"
import { useGetMarketDataQuery } from "@/state/api"
import type { MarketModelResponse, PricingComparison as PCType } from "@/state/type"
import { DollarSign, TrendingUp, AlertCircle } from "lucide-react"

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

export default function PricingComparison() {
  const { data: marketDataArray, isLoading, error: queryError } = useGetMarketDataQuery()

  const marketData: MarketModelResponse | undefined = marketDataArray?.[0]
  const pricingComparisonData: PCType | undefined | null = marketData?.pricing_comparison

  const competitors: Record<string, string> | undefined = pricingComparisonData?.competitors
  const discountStrategies: string[] | undefined = pricingComparisonData?.discount_strategies

  const hasCompetitors = competitors && Object.keys(competitors).length > 0
  const firstDiscountStrategy = discountStrategies?.[0]?.split(" (Source:")[0].trim() || "N/A"

  // Loading State
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-purple-100 dark:border-gray-700 p-6 h-full flex flex-col">
        <div className="animate-pulse">
          {/* Header skeleton */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 dark:bg-gray-700 rounded-lg"></div>
            <div>
              <div className="h-5 w-40 bg-purple-100 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-3 w-32 bg-purple-50 dark:bg-gray-600 rounded"></div>
            </div>
          </div>

          {/* Table skeleton */}
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="h-4 bg-purple-100 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-purple-100 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-purple-100 dark:bg-gray-700 rounded"></div>
            </div>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="grid grid-cols-3 gap-4">
                <div className="h-4 bg-purple-50 dark:bg-gray-800 rounded"></div>
                <div className="h-4 bg-purple-50 dark:bg-gray-800 rounded"></div>
                <div className="h-4 bg-purple-50 dark:bg-gray-800 rounded"></div>
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
        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
          <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Pricing Comparison</h2>
          <div className="flex items-center gap-1">
            {hasCompetitors ? (
              <>
                <TrendingUp className="w-3 h-3 text-green-500" />
                <span className="text-sm text-green-600 dark:text-green-400">
                  {Object.keys(competitors).length} competitor{Object.keys(competitors).length !== 1 ? "s" : ""}{" "}
                  analyzed
                </span>
              </>
            ) : (
              <span className="text-sm text-gray-500 dark:text-gray-400">No competitors available</span>
            )}
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
                <th className="text-center py-3 px-2 text-sm font-medium text-gray-600 dark:text-gray-300">Price</th>
                <th className="text-center py-3 px-2 text-sm font-medium text-gray-600 dark:text-gray-300">Strategy</th>
              </tr>
            </thead>
            <tbody>
              {hasCompetitors ? (
                Object.entries(competitors).map(([name, priceString], index) => {
                  const priceValue = priceString?.match(/\d+(\.\d+)?/)?.[0] ?? "N/A"
                  return (
                    <tr
                      key={name}
                      className="border-b border-purple-50 dark:border-gray-800 hover:bg-purple-25 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="py-4 px-2 font-medium text-gray-900 dark:text-white">{name}</td>
                      <td className="text-center py-4 px-2">
                        <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full text-sm font-medium">
                          ${priceValue}
                        </span>
                      </td>
                      <td className="text-center py-4 px-2 text-sm text-gray-600 dark:text-gray-300">
                        {firstDiscountStrategy}
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={3} className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No pricing comparison data available
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
