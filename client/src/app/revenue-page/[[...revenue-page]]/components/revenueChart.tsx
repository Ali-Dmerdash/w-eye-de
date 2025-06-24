"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { DollarSign, TrendingUp, AlertCircle } from "lucide-react"
import type { RevenueTrend } from "@/state/type"

// Define props type for CircularProgress
type CircularProgressProps = {
  percentage: number
  size?: number
  strokeWidth?: number
  color?: string
  label?: string
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  size = 200,
  strokeWidth = 12,
  color = "#8B5CF6",
  label = "",
}) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const validPercentage = Math.max(0, Math.min(100, percentage))
  const offset = circumference - (validPercentage / 100) * circumference

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            className="text-purple-100 dark:text-gray-700"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          <circle
            className="transition-all duration-1000 ease-in-out"
            strokeWidth={strokeWidth}
            stroke={color}
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: offset,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">{validPercentage}%</span>
          {label && <span className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</span>}
        </div>
      </div>
    </div>
  )
}

// Define props for RevenueChart
interface RevenueChartProps {
  trendData: RevenueTrend | undefined | null
}

const RevenueChart: React.FC<RevenueChartProps> = ({ trendData }) => {
  const [circleSize, setCircleSize] = useState<number>(200)

  useEffect(() => {
    const handleResize = () => {
      const vh = window.innerHeight
      setCircleSize(vh < 800 ? 160 : vh < 1000 ? 180 : 200)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  if (!trendData) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-purple-100 dark:border-gray-700 p-6 h-full flex items-center justify-center">
        <div className="text-center">
          <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No revenue data available</p>
        </div>
      </div>
    )
  }

  const confidenceColor =
    trendData.confidence_level === "High" ? "#10B981" : trendData.confidence_level === "Medium" ? "#F59E0B" : "#EF4444"

  const displayPercentage =
    trendData.confidence_level === "High" ? 90 : trendData.confidence_level === "Medium" ? 70 : 40

  const getConfidenceIcon = () => {
    switch (trendData.confidence_level) {
      case "High":
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case "Medium":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-red-500" />
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-purple-100 dark:border-gray-700 p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
          <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue Forecast</h2>
          <div className="flex items-center gap-1">
            {getConfidenceIcon()}
            <span className="text-sm text-gray-600 dark:text-gray-400">{trendData.confidence_level} Confidence</span>
          </div>
        </div>
      </div>

      {/* Chart and Value */}
      <div className="flex-grow flex flex-col items-center justify-center">
        <CircularProgress
          percentage={displayPercentage}
          color={confidenceColor}
          size={circleSize}
          label={trendData.confidence_level}
        />
        <div className="mt-6 text-center">
          <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{trendData.revenue_forecast}</div>
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 px-4 py-2 rounded-lg border border-purple-100 dark:border-purple-800/30">
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Projected Revenue</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RevenueChart
