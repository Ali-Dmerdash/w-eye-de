"use client"
import React from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"
import { Activity, AlertTriangle, Shield } from "lucide-react"
import { useGetFraudDataQuery } from "@/state/api"
import type { FraudModelResponse, FraudRateOverTime } from "@/state/type"
import { useUser } from "@clerk/nextjs"

// Helper function to format date for display
function formatDateForDisplay(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
}

// Helper function to format fraud rate for display
function formatFraudRate(rate: string | number): number {
  if (typeof rate === "string") {
    // If it's already a string with %
    if (rate.includes("%")) {
      // Extract the number part and check if it's in decimal format
      const numPart = Number.parseFloat(rate.replace("%", ""))
      if (isNaN(numPart)) return 0

      // If the number is less than 1, it's likely in decimal format (0.045% should be 4.5%)
      if (numPart < 1) {
        return numPart * 100
      }
      // Otherwise, return as is (already properly formatted)
      return numPart
    }
    // If it's a string number (like "0.045"), convert to percentage
    const numRate = Number.parseFloat(rate)
    if (isNaN(numRate)) return 0
    return numRate * 100
  }
  // If it's a number (like 0.045), convert to percentage
  return rate * 100
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

type CircularProgressProps = {
  percentage: number
  size?: number
  strokeWidth?: number
  color?: string
  label?: string
  icon?: React.ReactNode
}

const CircularProgress = ({
  percentage,
  size = 120,
  strokeWidth = 8,
  color = "#8B5CF6",
  label = "Current load",
  icon,
}: CircularProgressProps) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            className="text-purple-100"
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
          {icon && <div className="mb-1">{icon}</div>}
          <span className="text-lg font-bold text-gray-700 dark:text-white">{percentage}%</span>
          <span className="text-xs text-gray-500 text-center">{label}</span>
        </div>
      </div>
    </div>
  )
}

export default function FraudAnalyticsOverview() {
  const { user, isLoaded } = useUser();
  const filesUploaded = user?.unsafeMetadata?.filesUploaded;
  if (isLoaded && filesUploaded === false) {
    return (
      <div className="bg-white h-full dark:bg-gray-800 rounded-2xl shadow-lg border border-purple-100 dark:border-gray-700 p-6 flex flex-col items-center justify-center min-h-[200px]">
        <AlertTriangle className="w-8 h-8 text-yellow-500 mb-2" />
        <span className="text-gray-500 dark:text-gray-400 text-center font-medium">
          No data to display — file upload was bypassed.
        </span>
      </div>
    );
  }
  const [circleSize, setCircleSize] = React.useState(100)
  const { data: fraudDataArray, isLoading, error } = useGetFraudDataQuery()
  const fraudData: FraudModelResponse | undefined = fraudDataArray?.[0]

  React.useEffect(() => {
    const handleResize = () => {
      const vh = window.innerHeight
      setCircleSize(vh < 768 ? 100 : 140)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Transform fraud rate over time data for the chart
  const chartData = React.useMemo(() => {
    if (!fraudData?.fraud_rate_over_time) return []

    return fraudData.fraud_rate_over_time.map((item: FraudRateOverTime) => ({
      month: formatDateForDisplay(item.date),
      fraudRate: formatFraudRate(item.fraud_rate),
      originalDate: item.date,
    }))
  }, [fraudData])

  // --- Loading State ---
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-purple-100 dark:border-gray-700 p-6 h-full flex flex-col">
        <div className="animate-pulse">
          {/* Header skeleton */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-9 h-9 bg-purple-100 dark:bg-gray-700 rounded-lg"></div>
                <div className="h-5 w-48 bg-purple-100 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
            <div className="h-6 w-20 bg-purple-50 dark:bg-gray-600 rounded-full"></div>
          </div>

          {/* Chart skeleton */}
          <div className="flex-grow bg-purple-50 dark:bg-gray-700/50 rounded-xl"></div>
        </div>
      </div>
    )
  }

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
  if (!fraudData || !chartData.length) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-purple-100 dark:border-gray-700 p-6 h-full flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No fraud rate data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-purple-100 dark:border-gray-700 p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-9 h-9 text-purple-600 dark:text-purple-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Fraud Rate Over Time</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Monitor fraud patterns and trends</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">Fraud Rate</span>
          </div>
        </div>
      </div>

      <div className="flex-grow flex md:flex-row flex-col gap-6 min-h-[350px] md:min-h-[450px]">
        {/* Chart Area */}
        <div className="flex-grow min-h-[300px] md:min-h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorFraudRate" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" className="dark:stroke-gray-600" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#6B7280",
                  fontSize: 10, // Smaller font for mobile
                }}
                className="dark:fill-gray-400"
                interval="preserveStartEnd" // Better mobile spacing
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#6B7280",
                  fontSize: 10, // Smaller font for mobile
                }}
                domain={[0, "dataMax + 1"]}
                tickFormatter={(value) => `${value}%`}
                width={40} // Fixed width for mobile
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  fontSize: "12px", // Smaller tooltip for mobile
                }}
                labelStyle={{ color: "#374151", fontWeight: "600" }}
                formatter={(value: any) => [`${value}%`, "Fraud Rate"]}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Area
                type="monotone"
                dataKey="fraudRate"
                stroke="#8B5CF6"
                strokeWidth={2}
                fill="url(#colorFraudRate)"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
