"use client"
import { TrendingUp, DollarSign, PieChart, AlertTriangle } from "lucide-react"
import { useUser } from "@clerk/nextjs"

export default function ProfitAnalysisCard() {
  const { user, isLoaded } = useUser();
  const filesUploaded = user?.unsafeMetadata?.filesUploaded;
  // Calculate the percentage for the circle (profit margin)
  const profitMargin = 24.8
  const percentage = (profitMargin / 50) * 100 // Scale to 50% max for visual appeal
  const circumference = 2 * Math.PI * 40
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  if (isLoaded && filesUploaded === false) {
    return (
      <div className="h-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-purple-100 dark:border-gray-700 p-6 flex flex-col items-center justify-center min-h-[200px]">
        <AlertTriangle className="w-8 h-8 text-yellow-500 mb-2" />
        <span className="text-gray-500 dark:text-gray-400 text-center font-medium">
          No data to display — file upload was bypassed.
        </span>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-purple-100 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
          <PieChart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Profit Analysis</h3>
      </div>

      <div className="flex flex-col items-center">
        <div className="grid grid-cols-2 gap-3 mb-6 w-full">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-100 dark:border-green-800/30">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
              <p className="text-xs font-medium text-green-600 dark:text-green-400">Gross Profit</p>
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">$89.2K</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800/30">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <p className="text-xs font-medium text-blue-600 dark:text-blue-400">Net Profit</p>
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">$42.8K</p>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="relative w-24 h-24 mb-3">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-xl font-bold text-gray-900 dark:text-white">{profitMargin}%</p>
            </div>
          </div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Profit Margin</p>
          <div className="mt-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
            Above Target
          </div>
        </div>
      </div>
    </div>
  )
}
