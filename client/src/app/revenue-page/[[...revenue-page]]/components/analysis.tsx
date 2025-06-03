"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Brain, Lightbulb, X, FileText } from "lucide-react"
import type { RevenueAnalysis } from "@/state/type"

// Define props for AnalysisComponent
interface AnalysisComponentProps {
  analysisData: RevenueAnalysis | undefined | null
}

export default function AnalysisComponent({ analysisData }: AnalysisComponentProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  if (!analysisData) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-purple-100 dark:border-gray-700 p-6 h-full">
          <div className="animate-pulse">
            {/* Header skeleton */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 dark:bg-gray-700 rounded-lg"></div>
              <div>
                <div className="h-5 w-40 bg-purple-100 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-3 w-32 bg-purple-50 dark:bg-gray-600 rounded"></div>
              </div>
            </div>

            {/* Content skeleton */}
            <div className="space-y-4 mb-6">
              <div className="h-4 bg-purple-50 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-purple-50 dark:bg-gray-700 rounded w-11/12"></div>
              <div className="h-4 bg-purple-50 dark:bg-gray-700 rounded w-10/12"></div>
            </div>

            {/* Button skeleton */}
            <div className="h-10 bg-purple-100 dark:bg-gray-700 rounded-lg w-40"></div>
          </div>
        </div>
    )
  }

  return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-purple-100 dark:border-gray-700 h-full flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-purple-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue Analysis</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">AI-powered insights and recommendations</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-grow p-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800/30">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex-shrink-0">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Key Insights</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{analysisData.insights}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-purple-100 dark:border-gray-700">
          <Button
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            <Lightbulb className="w-4 h-4" />
            View Recommendations
          </Button>
        </div>

        {/* Modal */}
        {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full border border-purple-100 dark:border-gray-700">
                {/* Modal Header */}
                <div className="p-6 border-b border-purple-100 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <Lightbulb className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Recommendations</h3>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-6">
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-purple-100 dark:border-purple-800/30">
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {analysisData.recommendation}
                    </p>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-6 border-t border-purple-100 dark:border-gray-700">
                  <Button
                      onClick={() => setIsModalOpen(false)}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
        )}
      </div>
  )
}
