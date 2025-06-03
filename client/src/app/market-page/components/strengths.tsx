"use client"
import { useGetMarketDataQuery } from "@/state/api"
import type { MarketModelResponse, SwotAnalysis } from "@/state/type"
import { Shield, CheckCircle, AlertCircle, TrendingUp, Award } from "lucide-react"

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

  const marketData: MarketModelResponse | undefined = marketDataArray?.[0]
  const swotData: SwotAnalysis | undefined | null = marketData?.swot_analysis
  const strengths: string[] | undefined = swotData?.strengths

  const hasStrengths = strengths && strengths.length > 0
  const strengthText = hasStrengths ? strengths[0].split(" (Source:")[0].trim() : "No strengths data available."

  // Loading State
  if (isLoading) {
    return (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl shadow-lg border border-green-200 dark:border-green-800/30 p-6 h-full flex flex-col relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
            <div className="w-full h-full bg-green-300 rounded-full transform translate-x-6 -translate-y-6"></div>
          </div>

          <div className="animate-pulse">
            {/* Header skeleton */}
            <div className="flex flex-col text-center items-center gap-3 mb-4 relative z-10">
              <div className="p-2.5 bg-green-200 dark:bg-green-800/50 rounded-xl"></div>
              <div>
                <div className="h-5 w-20 bg-green-200 dark:bg-green-800/50 rounded mb-2"></div>
                <div className="flex items-center gap-1 justify-center">
                  <div className="w-3 h-3 bg-green-100 dark:bg-green-900/30 rounded-full"></div>
                  <div className="h-3 w-32 bg-green-100 dark:bg-green-900/30 rounded"></div>
                </div>
              </div>
            </div>

            {/* Content skeleton */}
            <div className="flex-grow flex items-center justify-center relative z-10">
              <div className="text-center space-y-4">
                <div className="space-y-2">
                  <div className="h-4 w-44 bg-green-100 dark:bg-green-900/30 rounded mx-auto"></div>
                  <div className="h-4 w-38 bg-green-100 dark:bg-green-900/30 rounded mx-auto"></div>
                  <div className="h-4 w-32 bg-green-100 dark:bg-green-900/30 rounded mx-auto"></div>
                </div>
              </div>
            </div>

            {/* Footer skeleton */}
            <div className="mt-4 pt-3 border-t border-green-200 dark:border-green-800/30 relative z-10">
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-green-200 dark:bg-green-800/50 rounded-full"></div>
                <div className="h-3 w-24 bg-green-100 dark:bg-green-900/30 rounded"></div>
              </div>
            </div>
          </div>
        </div>
    )
  }

  // Error State
  if (queryError) {
    return (
        <div className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 rounded-2xl shadow-lg border border-red-200 dark:border-red-800/30 p-6 h-full flex flex-col items-center justify-center">
          <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
          <p className="text-sm text-red-600 dark:text-red-400 text-center font-medium">{getErrorMessage(queryError)}</p>
        </div>
    )
  }

  return (
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl shadow-lg border border-green-200 dark:border-green-800/30 p-6 h-full flex flex-col relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
          <div className="w-full h-full bg-green-300 rounded-full transform translate-x-6 -translate-y-6"></div>
        </div>

        {/* Header */}
        <div className="flex flex-col text-center items-center gap-3 mb-4 relative z-10">
          <div className="p-2.5 bg-green-100 dark:bg-green-900/50 rounded-xl shadow-sm">
            <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="font-bold text-green-800 dark:text-green-300 text-lg">Strengths</h3>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Competitive Advantages</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-grow flex items-center justify-center relative z-10">
          {hasStrengths ? (
              <div className="text-center">

                <div className="space-y-6">
                  <p className="text-sm text-green-800 dark:text-green-200 leading-relaxed font-bold font-mulish px-2">
                    {strengthText}
                  </p>

                </div>
              </div>
          ) : (
              <div className="text-center space-y-4">
                <div className="bg-gray-100 dark:bg-gray-800/50 p-4 rounded-full">
                  <Shield className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 px-2">{strengthText}</p>
              </div>
          )}
        </div>

        {/* Footer Indicator */}
        {hasStrengths && (
            <div className="mt-4 pt-3 border-t border-green-200 dark:border-green-800/30 relative z-10">
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-600 dark:text-green-400 font-medium">Active Strength</span>
              </div>
            </div>
        )}
      </div>
  )
}
