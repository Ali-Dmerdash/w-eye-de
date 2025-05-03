"use client";
import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"; // Assuming similar imports

// Define an interface for the expected data structure (adjust as needed)
interface RevenueData {
  revenue_forecast: string;
  confidence_level: string;
  // Add other fields if the chart uses them
}

// Dummy data for the chart - replace or fetch real chart data if needed
const chartData = [
  { month: "Jan", value: 400 },
  { month: "Feb", value: 300 },
  { month: "Mar", value: 600 },
  { month: "Apr", value: 500 },
  // ... add more data points
];

export default function RevenueChart() {
  const [revenueDataState, setRevenueDataState] = useState<RevenueData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/revenue-data"); // Fetch from the new API route
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: RevenueData = await response.json();
        setRevenueDataState(data);
      } catch (e: any) {
        console.error("Failed to fetch revenue data:", e);
        setError(e.message || "Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading)
    return (
      <div className="text-white p-6 bg-[#1d2328] rounded-lg h-full flex items-center justify-center">
        Loading Chart...
      </div>
    );
  if (error)
    return (
      <div className="text-red-500 p-6 bg-[#1d2328] rounded-lg h-full flex items-center justify-center">
        Error loading chart data: {error}
      </div>
    );
  // if (!revenueDataState) return <div className="text-white p-6">No forecast data.</div>; // Optional: Check if forecast data is needed before rendering chart

  return (
    <div className="p-6 bg-[#1d2328] rounded-lg h-full flex flex-col text-white">
      <h2 className="text-lg font-semibold mb-2">Revenue Overview</h2>
      {revenueDataState && (
        <p className="text-sm mb-4">
          Forecast: {revenueDataState.revenue_forecast} (Confidence:{" "}
          {revenueDataState.confidence_level})
        </p>
      )}
      <div className="flex-grow">
        {/* Assuming a similar chart structure - adapt as needed */}
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="rgba(255, 255, 255, 0.1)"
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 10 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 10 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "12px",
                padding: "4px 8px",
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#8884d8"
              strokeWidth={2}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
