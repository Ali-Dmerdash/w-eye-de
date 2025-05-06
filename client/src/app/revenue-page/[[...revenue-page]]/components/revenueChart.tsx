"use client";
import React, { useState, useEffect } from "react"; // Import React
import revenueData from "../revenueData.json"; // Correct path from src/components to src

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
  color = "#3B82F6", // Default color
  label = "", // Default empty label
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  // Ensure percentage is within 0-100 range
  const validPercentage = Math.max(0, Math.min(100, percentage));
  const offset = circumference - (validPercentage / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            className="text-gray-700" // Background circle color
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
            stroke={color} // Progress circle color based on props
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
          {/* Display percentage only if it's a valid number */}
          {typeof validPercentage === "number" && !isNaN(validPercentage) && (
            <span className="text-xl font-bold text-white">
              {validPercentage}%
            </span>
          )}
          {/* Display label if provided */}
          {label && (
            <span className="text-xs text-gray-400">{label.toUpperCase()}</span>
          )}{" "}
          {/* Uppercase label */}
        </div>
      </div>
    </div>
  );
};

const RevenueChart: React.FC = () => {
  // Add React.FC type
  const [circleSize, setCircleSize] = useState<number>(300); // Add type for state

  useEffect(() => {
    const handleResize = () => {
      const vh = window.innerHeight;
      // Adjust size based on viewport height, providing a fallback
      setCircleSize(vh < 800 ? 200 : vh < 1000 ? 250 : 300);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Access data directly from the imported JSON object
  const forecast = revenueData;

  // Determine color based on confidence level
  const confidenceColor =
    forecast.confidence_level === "High"
      ? "#E31A1A" // Red
      : forecast.confidence_level === "Medium"
      ? "#F97316" // Orange
      : "#01B574"; // Green (or a default)

  // Assuming the 70% is static or derived differently, using a fixed value for now
  // If confidence_level maps to percentage, logic needs adjustment
  const displayPercentage = 70; // Hardcoded based on image, adjust if dynamic

  return (
    <div className="bg-[#1d2328] text-white font-bayon p-6 rounded-lg h-full flex flex-col text-center">
      <div className="flex flex-col items-center justify-center h-full">
        <CircularProgress
          percentage={displayPercentage} // Use the determined percentage
          color={confidenceColor} // Use the determined color
          size={circleSize}
          label={forecast.confidence_level} // Display confidence level as label
        />
        <div className="py-4 flex flex-col">
          <span className="text-5xl">{forecast.revenue_forecast}</span>
          <span className="text-base text-gray-400 font-mulish">
            Revenue Forecast
          </span>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;
