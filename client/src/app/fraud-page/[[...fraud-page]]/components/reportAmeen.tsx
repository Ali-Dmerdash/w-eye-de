"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useGetFraudDataQuery } from "@/state/api"
import type { Analysis } from "@/state/type"
import { FileText, Brain, AlertCircle, CheckCircle } from "lucide-react"

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

const ReportAmeen = () => {
  const [expanded, setExpanded] = useState(false)
  const { data: fraudDataArray, isLoading, error } = useGetFraudDataQuery()
  const analysisData: Analysis | undefined | null = fraudDataArray?.[0]?.analysis

  // --- Loading State ---
  if (isLoading)
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-purple-100 dark:border-gray-700 p-6 h-full flex flex-col">
          <div className="animate-pulse">
            {/* Header skeleton */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 dark:bg-gray-700 rounded-lg"></div>
              <div>
                <div className="h-5 w-32 bg-purple-100 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-3 w-20 bg-purple-50 dark:bg-gray-600 rounded"></div>
              </div>
            </div>

            {/* Content skeleton */}
            <div className="space-y-4 mb-6">
              <div className="h-4 bg-purple-50 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-purple-50 dark:bg-gray-700 rounded w-11/12"></div>
              <div className="h-4 bg-purple-50 dark:bg-gray-700 rounded w-10/12"></div>
            </div>

            {/* Button skeleton */}
            <div className="h-10 bg-purple-100 dark:bg-gray-700 rounded-lg w-32"></div>
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
  if (!analysisData) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-purple-100 dark:border-gray-700 p-6 h-full flex items-center justify-center">
          <div className="text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No analysis data available</p>
          </div>
        </div>
    )
  }

  // --- Success State ---
  const causeText = analysisData.cause || "Cause information not available."
  const recommendationText = analysisData.recommendation || "Recommendation not available."
  const shortText = causeText
  const fullText = `${causeText} <br /><br /> ${recommendationText}`

  return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-purple-100 dark:border-gray-700 h-full flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-purple-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">AI Analysis Report</h2>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span className="text-sm text-green-600 dark:text-green-400">Analysis Complete</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-grow p-6">
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-purple-100 dark:border-purple-800/30">
            <p
                className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: expanded ? fullText : shortText,
                }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-purple-100 dark:border-gray-700">
          <Button
              onClick={() => setExpanded(!expanded)}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200"
          >
            {expanded ? "Show Less" : "Generate Full Report"}
          </Button>
        </div>
      </div>
  )
}

export default ReportAmeen
