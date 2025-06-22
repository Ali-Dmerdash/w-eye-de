"use client"
import React from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"
import { TrendingUp, TrendingDown, Activity } from "lucide-react"

const data = [
  { month: "Jan", fraudulent: 180, legitimate: 500 },
  { month: "Feb", fraudulent: 200, legitimate: 300 },
  { month: "Mar", fraudulent: 350, legitimate: 250 },
  { month: "Apr", fraudulent: 400, legitimate: 300 },
  { month: "May", fraudulent: 450, legitimate: 350 },
  { month: "Jun", fraudulent: 400, legitimate: 300 },
  { month: "Jul", fraudulent: 300, legitimate: 200 },
  { month: "Aug", fraudulent: 350, legitimate: 250 },
  { month: "Sep", fraudulent: 300, legitimate: 200 },
  { month: "Oct", fraudulent: 200, legitimate: 150 },
  { month: "Nov", fraudulent: 400, legitimate: 300 },
  { month: "Dec", fraudulent: 450, legitimate: 350 },
]

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
  const [circleSize, setCircleSize] = React.useState(100)

  React.useEffect(() => {
    const handleResize = () => {
      const vh = window.innerHeight
      setCircleSize(vh < 768 ? 100 : 140)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-purple-100 dark:border-gray-700 p-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Activity className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Transaction Analysis</h2>
            </div>
            {/* <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">+5% detection rate this month</p>
            </div> */}
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 px-3 py-1 rounded-full">
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Q4 2024</span>
          </div>
        </div>

        <div className="flex-grow flex md:flex-row flex-col gap-6">
          {/* Chart Area */}
          <div className="flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorFraudulent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorLegitimate" x1="0" y1="0" x2="0" y2="1">
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
                      fontSize: 12,
                    }}
                    className="dark:fill-gray-400"
                />
                <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "#6B7280",
                      fontSize: 12,
                    }}
                    className="dark:fill-gray-400"
                    domain={[0, 600]}
                />
                <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #E5E7EB",
                      borderRadius: "12px",
                      color: "#374151",
                      fontSize: "12px",
                      padding: "8px 12px",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    }}
                />
                <Area
                    type="monotone"
                    dataKey="fraudulent"
                    stroke="#EF4444"
                    strokeWidth={2}
                    fill="url(#colorFraudulent)"
                    name="Fraudulent"
                />
                <Area
                    type="monotone"
                    dataKey="legitimate"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    fill="url(#colorLegitimate)"
                    name="Legitimate"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Metrics */}
          <div className="md:w-32 flex md:flex-col flex-row md:gap-4 gap-6 justify-center md:items-center items-center">
            <CircularProgress
                percentage={85}
                color="#10B981"
                size={circleSize}
                label="Detection Rate"
                icon={<TrendingUp className="w-4 h-4 text-green-500" />}
            />
            <CircularProgress
                percentage={12}
                color="#EF4444"
                size={circleSize}
                label="False Positives"
                icon={<TrendingDown className="w-4 h-4 text-red-500" />}
            />
            <CircularProgress
                percentage={73}
                color="#8B5CF6"
                size={circleSize}
                label="Accuracy"
                icon={<Activity className="w-4 h-4 text-purple-500" />}
            />
          </div>
        </div>
      </div>
  )
}
