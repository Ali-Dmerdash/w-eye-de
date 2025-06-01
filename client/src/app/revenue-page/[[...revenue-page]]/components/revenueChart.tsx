"use client";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import React, { useState, useEffect } from "react";
// Removed Redux hook import
import { RevenueTrend } from "@/state/type"; // Keep type import

// Define props type for CircularProgress
type CircularProgressProps = {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
};

const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  size = 150,
  strokeWidth = 8,
  color = "#3B82F6",
  label = "",
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const validPercentage = Math.max(0, Math.min(100, percentage));
  const offset = circumference - (validPercentage / 100) * circumference;

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
          <span className="text-xl font-bold text-white">
            {validPercentage}%
          </span>
          {label && (
            <span className="text-xs text-gray-400">{label.toUpperCase()}</span>
          )}
        </div>
      </div>
    </div>
  );
};

// Define props for RevenueChart
interface RevenueChartProps {
  trendData: RevenueTrend | undefined | null;
  // Pass isLoading and error states if needed for component-specific loading/error UI,
  // but the parent (page.tsx) will likely handle the main loading/error states.
}

const RevenueChart: React.FC<RevenueChartProps> = ({ trendData }) => {
  const [circleSize, setCircleSize] = useState<number>(300);
  // Removed Redux hook call

  useEffect(() => {
    const handleResize = () => {
      const vh = window.innerHeight;
      setCircleSize(vh < 800 ? 200 : vh < 1000 ? 250 : 300);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Loading and error handling will now be done in the parent component (page.tsx)
  // We assume trendData is valid if the component is rendered without loading/error state from parent

  if (!trendData) {
    // This might indicate data is still loading in parent or an error occurred there.
    // Or simply no data was returned from the API.
    // Render a minimal state or rely on parent's handling.
    return (
      <div className="bg-[#4B65AB] dark:bg-[#1d2328] text-white font-bayon p-6 rounded-lg h-full flex flex-col items-center justify-center space-y-6">
        <div className="text-white p-6 rounded-lg h-full flex items-center justify-center">
          No data available or still loading...
        </div>
      </div>
    );
  }

  const confidenceColor =
    trendData.confidence_level === "High"
      ? "#E31A1A"
      : trendData.confidence_level === "Medium"
      ? "#F97316"
      : "#01B574";

  const displayPercentage =
    trendData.confidence_level === "High"
      ? 90
      : trendData.confidence_level === "Medium"
      ? 70
      : 40;

  return (
    <div className="bg-[#4B65AB] dark:bg-[#1d2328] text-white font-bayon p-6 rounded-lg h-full flex flex-col text-center">
      <div className="flex flex-col items-center justify-center h-full">
        <CircularProgress
          percentage={displayPercentage}
          color={confidenceColor}
          size={circleSize}
          label={trendData.confidence_level}
        />
        <div className="py-4 flex flex-col">
          <span className="text-5xl">{trendData.revenue_forecast}</span>
          <span className="text-base text-[#AEC3FF] dark:text-gray-400 font-mulish">
            Revenue Forecast
          </span>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;
