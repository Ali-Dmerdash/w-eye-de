"use client"
import { useGetMarketDataQuery } from "@/state/api"
import type { MarketModelResponse, PricingComparison as PCType } from "@/state/type"
import { DollarSign, TrendingUp, AlertCircle } from "lucide-react"

export default function PricingComparison() {
  const { data: marketDataArray, isLoading, error: queryError } = useGetMarketDataQuery()

  const pricingComparisonData: PCType | undefined | null = marketDataArray?.[0]?.pricing_comparison

  // Parse new response structure
  const competitorPricing = pricingComparisonData?.competitor_pricing || []
  const ourPricing = pricingComparisonData?.our_pricing || []

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
              <div className="h-3 w-24 bg-purple-50 dark:bg-gray-600 rounded"></div>
            </div>
          </div>

          {/* Content skeleton */}
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 bg-purple-50 dark:bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Error State
  if (queryError || !pricingComparisonData) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-red-200 dark:border-red-800 p-6 h-full flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 dark:text-red-400">
            {queryError ? "Error loading pricing data" : "No pricing comparison data available"}
          </p>
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
          <p className="text-sm text-gray-500 dark:text-gray-400">Competitive pricing analysis</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow overflow-hidden">
        <div className="space-y-4">
          {/* Competitor Pricing */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Competitor Pricing</h3>
            <div className="space-y-2">
              {competitorPricing.map((competitor, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-red-600 dark:text-red-400">{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{competitor.competitor}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{competitor.product_line}</p>
                    </div>
                  </div>
                  <div className="bg-red-100 dark:bg-red-900/50 px-3 py-1 rounded-full">
                    <span className="text-sm font-semibold text-red-700 dark:text-red-300">{competitor.price_range}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Our Pricing */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Our Pricing</h3>
            <div className="space-y-2">
              {ourPricing.map((pricing, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800/30">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Our Product</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{pricing.product_line}</p>
                    </div>
                  </div>
                  <div className="bg-green-100 dark:bg-green-900/50 px-3 py-1 rounded-full">
                    <span className="text-sm font-semibold text-green-700 dark:text-green-300">{pricing.price_range}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

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
