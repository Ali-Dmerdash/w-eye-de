"use client"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useEffect, useState } from "react"

const data = [
  { month: "Jan", value1: 180, value2: 500 },
  { month: "Feb", value1: 200, value2: 300 },
  { month: "Mar", value1: 350, value2: 250 },
  { month: "Apr", value1: 400, value2: 300 },
  { month: "May", value1: 450, value2: 350 },
  { month: "Jun", value1: 400, value2: 300 },
  { month: "Jul", value1: 300, value2: 200 },
  { month: "Aug", value1: 350, value2: 250 },
  { month: "Sep", value1: 300, value2: 200 },
  { month: "Oct", value1: 200, value2: 150 },
  { month: "Nov", value1: 400, value2: 300 },
  { month: "Dec", value1: 450, value2: 350 },
]

type CircularProgressProps = {
  percentage: number
  size?: number
  strokeWidth?: number
  color?: string
  label?: string
}

const CircularProgress = ({
  percentage,
  size = 150,
  strokeWidth = 8,
  color = "#3B82F6",
  label = "Current load",
}: CircularProgressProps) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            className="text-gray-700"
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
          <span className="text-xl font-bold text-white">{percentage}%</span>
          <span className="text-xs text-white">{label}</span>
        </div>
      </div>
    </div>
  )
}

export default function SalesOverview() {
  const [circleSize, setCircleSize] = useState(100)

  useEffect(() => {
    const handleResize = () => {
      const vh = window.innerHeight
      setCircleSize(vh < 800 ? 90 : 100)
    }
  
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className="md:p-6 p-4 bg-[#4B65AB] dark:bg-[#1d2328] rounded-lg h-full flex flex-col justify-center">
      <div className="mb-2">
        <h2 className="text-base font-semibold text-white">Sales overview</h2>
        <p className="text-sm text-emerald-500">(+5) more in 2021</p>
      </div>

      <div className="flex-grow flex md:flex-row flex-col">
        <div className="flex-grow">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#AEC3FF" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#AEC3FF" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorValue2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4ED7F1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4ED7F1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(174, 195, 255, 0.1)" />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ 
                  fill: "var(--axis-color, #1d2328)", 
                  fontSize: 10 
                }} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ 
                  fill: "var(--axis-color, #1d2328)", 
                  fontSize: 10 
                }} 
                domain={[0, 600]} 
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#243461",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                  fontSize: "12px",
                  padding: "4px 8px",
                }}
              />
              <Area type="monotone" dataKey="value1" stroke="#AEC3FF" strokeWidth={2} fill="url(#colorValue1)" />
              <Area 
                type="monotone" 
                dataKey="value2" 
                stroke="var(--second-gradient, #4B65AB)" 
                strokeWidth={2} 
                fill="url(#colorValue2)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="md:w-28 flex md:flex-col flex-row md:gap-0 gap-6 md:space-y-4 pt-5 md:pt-0 justify-center md:items-end items-center">
          <CircularProgress percentage={70} color="#01B574" size={circleSize} label="Sales" />
          <CircularProgress percentage={50} color="#F87171" size={circleSize} label="Revenue" />
          <CircularProgress percentage={44} color="#F87171" size={circleSize} label="Growth" />
        </div>

      </div>
      
    </div>
  )
}

