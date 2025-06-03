"use client"
import { useGetFraudDataQuery } from "@/state/api"
import type { FraudModelResponse } from "@/state/type"
import { AlertTriangle, Shield, TrendingUp } from "lucide-react"

// Helper function to get a safe error message string
function getErrorMessage(error: unknown): string {
  if (!error) {
    return "An unknown error occurred"
  }
  if (typeof error === "object" && error !== null) {
    if ("status" in error) {
      return `Error: ${error.status}`
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

export default function FraudInc() {
  const { data: fraudDataArray, isLoading, error } = useGetFraudDataQuery()
  const fraudDataState: FraudModelResponse | undefined = fraudDataArray?.[0]

  // --- Loading State ---
  if (isLoading)
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

            {/* Main metric skeleton */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl p-6 mb-6">
              <div className="text-center">
                <div className="h-6 w-48 bg-red-100 dark:bg-red-800/50 rounded mx-auto mb-4"></div>
                <div className="h-16 w-24 bg-red-200 dark:bg-red-700/50 rounded mx-auto"></div>
              </div>
            </div>

            {/* Patterns skeleton */}
            <div className="space-y-4">
              <div className="h-5 w-56 bg-purple-100 dark:bg-gray-700 rounded"></div>
              {Array.from({ length: 3 }).map((_, i) => (
                  <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-purple-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 dark:bg-gray-600 rounded"></div>
                      <div className="h-4 w-32 bg-purple-100 dark:bg-gray-600 rounded"></div>
                    </div>
                    <div className="h-6 w-12 bg-purple-200 dark:bg-gray-600 rounded-full"></div>
                  </div>
              ))}
            </div>
          </div>
        </div>
    )

  // --- Error State ---
  if (error) {
    const errorMessage = getErrorMessage(error)
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-red-200 dark:border-red-800 p-6 h-full flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 dark:text-red-400">Error: {errorMessage}</p>
          </div>
        </div>
    )
  }

  // --- No Data State ---
  if (!fraudDataState) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-purple-100 dark:border-gray-700 p-6 h-full flex items-center justify-center">
          <div className="text-center">
            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No fraud data available</p>
          </div>
        </div>
    )
  }

  // --- Success State ---
  return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-purple-100 dark:border-gray-700 p-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Fraud Detection</h2>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-red-500" />
              <span className="text-sm text-red-600 dark:text-red-400">High Alert</span>
            </div>
          </div>
        </div>

        {/* Main Metric */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl p-6 mb-6 border border-red-100 dark:border-red-800/30">
          <div className="text-center">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2 uppercase tracking-wide">
              Fraud Incidence Rate
            </h3>
            <p className="text-4xl font-bold text-red-600 dark:text-red-400">
              {fraudDataState.fraud_metrics.incident_rate}
            </p>
          </div>
        </div>

        {/* Patterns */}
        <div className="flex-grow">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">
            Common Fraudulent Patterns
          </h3>
          <div className="space-y-3">
            {Object.entries(fraudDataState.fraud_metrics.common_patterns).map(([pattern, percentage], index) => (
                <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-purple-50 dark:bg-gray-700/50 rounded-lg border border-purple-100 dark:border-gray-600"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-purple-600 dark:text-purple-400">{index + 1}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                  {pattern.endsWith(".") ? pattern.slice(0, -1) : pattern}
                </span>
                  </div>
                  <div className="bg-purple-100 dark:bg-purple-900/50 px-3 py-1 rounded-full">
                    <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">{percentage}</span>
                  </div>
                </div>
            ))}
          </div>
        </div>
      </div>
  )
}
