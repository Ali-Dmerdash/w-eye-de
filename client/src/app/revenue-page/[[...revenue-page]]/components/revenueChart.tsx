
"use client"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useState } from 'react';
import { useEffect } from 'react';

const revForecast = [
  {
    id: 1,
    revenue_forecast: "$1,234,567",
    confidence_level: "High",
    key_factors: {
      SeasonalDemand: "0.3/High",
      MarketingCampaignEffectiveness: "0.2/Medium",
      EconomicIndicators: "0.5/High"
    },
    analysis: {
      insights: "Based on historical sales data and current market trends, we expect a significant increase in revenue due to the upcoming holiday season. The effectiveness of our marketing campaigns will also play a crucial role in driving sales.",
      recommendation: "Increase marketing budget by 10% to capitalize on seasonal demand, and optimize product offerings to align with consumer preferences."
    }

  }
];

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
          <span className="text-xs text-gray-400">{label}</span>
        </div>
      </div>
    </div>
  )
}


export default function revenueChart() {
  const [circleSize, setCircleSize] = useState(300)

  useEffect(() => {
    const handleResize = () => {
      const vh = window.innerHeight
      setCircleSize(vh < 800 ? 200 : 300)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])


  return (

    <div className="bg-[#1d2328] text-white font-bayon p-6 rounded-lg h-full flex flex-col text-center">
      {revForecast.map((forecast) => (
        <div key={forecast.id} className="flex flex-col items-center justify-center h-full">
          <CircularProgress percentage={70}
            color={forecast.confidence_level === "High" ? "#E31A1A"
              : forecast.confidence_level === "Medium" ? "#F97316" :
                "#01B574"}
            size={circleSize}
            label={forecast.confidence_level} />
            <div className="py-4 flex flex-col">
            <span className="text-5xl ">
              {forecast.revenue_forecast}
            </span>
            <span className="text-lg text-gray-400">
              Revenue Forecast
            </span>
            </div>

        </div>
      ))}
    </div>
  )
}

