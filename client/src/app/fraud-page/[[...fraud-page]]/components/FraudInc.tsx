"use client"
import { useGetFraudDataQuery } from "@/state/api"
import type { FraudModelResponse } from "@/state/type"
import { AlertTriangle, Shield, TrendingUp, CheckCircle, AlertCircle } from "lucide-react"

// Helper function to format fraud rate for display
function formatFraudRate(rate: string | number): string {
  if (typeof rate === 'string') {
    // If it's already a string with %
    if (rate.includes('%')) {
      // Extract the number part and check if it's in decimal format
      const numPart = parseFloat(rate.replace('%', ''))
      if (isNaN(numPart)) return rate
      
      // If the number is less than 1, it's likely in decimal format (0.045% should be 4.5%)
      if (numPart < 1) {
        return `${(numPart * 100).toFixed(1)}%`
      }
      // Otherwise, return as is (already properly formatted)
      return rate
    }
    // If it's a string number (like "0.045"), convert to percentage
    const numRate = parseFloat(rate)
    if (isNaN(numRate)) return rate
    return `${(numRate * 100).toFixed(1)}%`
  }
  // If it's a number (like 0.045), convert to percentage
  return `${(rate * 100).toFixed(1)}%`
}

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

export default function FraudInc() {
  const { data: fraudDataArray, isLoading, error } = useGetFraudDataQuery()
  const fraudData: FraudModelResponse | undefined = fraudDataArray?.[0]

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
            <div className="space-y-3">
              <div className="h-4 bg-purple-50 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-purple-50 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-purple-50 dark:bg-gray-700 rounded w-1/2"></div>
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
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 dark:text-red-400">Error: {errorMessage}</p>
          </div>
        </div>
    )
  }

  // --- No Data State ---
  if (!fraudData) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-purple-100 dark:border-gray-700 p-6 h-full flex items-center justify-center">
          <div className="text-center">
            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No fraud metrics available</p>
          </div>
        </div>
    )
  }

  // --- Success State ---
  const fraudMetrics = fraudData.fraud_metrics
  const mainPercentage = fraudMetrics?.incident_rate || "0%"
  const commonPatterns = fraudMetrics?.common_patterns || {}

  return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-purple-100 dark:border-gray-700 p-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Fraud Incident Rate</h2>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-green-500" />
              <span className="text-sm text-green-600 dark:text-green-400">Real-time monitoring</span>
            </div>
          </div>
        </div>

        {/* Main Metric */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl p-6 mb-6">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400 text-sm font-medium mb-2">Current Fraud Rate</p>
            <div className="text-4xl font-bold text-red-700 dark:text-red-300">
              {formatFraudRate(mainPercentage)}
            </div>
          </div>
        </div>

        {/* Common Fraudulent Patterns */}
        <div className="flex-grow">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Common Fraudulent Patterns</h3>
          <div className="space-y-3">
            {Object.entries(commonPatterns).map(([pattern, description], index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-grow">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{pattern}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{description}</p>
                  </div>
                </div>
            ))}
          </div>
        </div>
      </div>
  )
}
