"use client";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import React, { useState, useEffect } from "react";

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

type RevenueData = {
  revenue_forecast: string;
  confidence_level: string;
};

const RevenueChart: React.FC = () => {
  const [circleSize, setCircleSize] = useState<number>(300);
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => {
      const vh = window.innerHeight;
      setCircleSize(vh < 800 ? 200 : vh < 1000 ? 250 : 300);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/revenue-data");
        if (!res.ok) throw new Error("Failed to fetch data");
        const data: RevenueData = await res.json();
        setRevenueData(data);
      } catch (err: any) {
        setError(err.message || "Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading)
    return (
      <div className="bg-[#1d2328] text-white font-bayon p-6 rounded-lg h-full flex flex-col items-center justify-center space-y-6">
        <div className="space-y-6">
        <LoadingSpinner width="8rem" height="8rem" />

          <div className="h-6 bg-gray-700 rounded w-56 mx-auto mb-4 pulse" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-700 rounded w-28 mx-auto pulse" />
            <div className="h-4 bg-gray-700 rounded w-20 mx-auto pulse" />
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="text-red-500 p-6 bg-[#1d2328] rounded-lg h-full flex items-center justify-center">
        Error: {error}
      </div>
    );

  if (!revenueData)
    return (
      <div className="text-white p-6 bg-[#1d2328] rounded-lg h-full flex items-center justify-center">
        No data available.
      </div>
    );

  const confidenceColor =
    revenueData.confidence_level === "High"
      ? "#E31A1A"
      : revenueData.confidence_level === "Medium"
      ? "#F97316"
      : "#01B574";

  const displayPercentage = 70; // Still static unless you have logic to convert confidence level to %

  return (
    <div className="bg-[#1d2328] text-white font-bayon p-6 rounded-lg h-full flex flex-col text-center">
      <div className="flex flex-col items-center justify-center h-full">
        <CircularProgress
          percentage={displayPercentage}
          color={confidenceColor}
          size={circleSize}
          label={revenueData.confidence_level}
        />
        <div className="py-4 flex flex-col">
          <span className="text-5xl">{revenueData.revenue_forecast}</span>
          <span className="text-base text-gray-400 font-mulish">
            Revenue Forecast
          </span>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;
