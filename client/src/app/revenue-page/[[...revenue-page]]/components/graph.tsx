"use client"
import React from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, TooltipProps } from "recharts"
import { TrendingUp, Shield, AlertTriangle } from "lucide-react"
import { useUser } from "@clerk/nextjs"

// Helper function to parse currency string to number
function parseCurrency(value: string): number {
  return Number(value.replace(/[^\d.-]+/g, ""));
}

// Months in order
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const QUARTERS = [
  { label: "All Year", months: [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ] },
  { label: "Q1", months: ["January", "February", "March"] },
  { label: "Q2", months: ["April", "May", "June"] },
  { label: "Q3", months: ["July", "August", "September"] },
  { label: "Q4", months: ["October", "November", "December"] },
];

interface RevenueGraphProps {
  monthlyForecast?: Record<string, string>;
}

const RevenueGraph: React.FC<RevenueGraphProps> = ({ monthlyForecast }) => {
  const { user, isLoaded } = useUser();
  const filesUploaded = user?.unsafeMetadata?.filesUploaded;
  const [selectedQuarter, setSelectedQuarter] = React.useState<string>("All Year");

  // Prepare chart data from monthlyForecast
  const chartData = React.useMemo(() => {
    if (!monthlyForecast) return [];
    const monthsToShow = QUARTERS.find(q => q.label === selectedQuarter)?.months || QUARTERS[0].months;
    return monthsToShow.map((month) => ({
      month,
      value: monthlyForecast[month] ? parseCurrency(monthlyForecast[month]) : 0
    }));
  }, [monthlyForecast, selectedQuarter]);

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

  if (!monthlyForecast || chartData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-purple-100 dark:border-gray-700 p-6 h-full flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No revenue forecast data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-purple-100 dark:border-gray-700 p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue Forecast (Next Year)</h2>
        </div>
        {/* Quarter Dropdown */}
        <div className="relative">
          <select
            className="appearance-none border border-purple-300 dark:border-gray-700 rounded-lg px-4 py-2 pr-8 text-sm bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-colors duration-200 shadow-sm hover:border-purple-500 cursor-pointer"
            value={selectedQuarter}
            onChange={e => setSelectedQuarter(e.target.value)}
          >
            {QUARTERS.map(q => (
              <option key={q.label} value={q.label}>{q.label}</option>
            ))}
          </select>
          {/* Custom arrow */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-purple-500 dark:text-purple-300">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
      <div className="flex-grow overflow-auto relative">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 10, bottom: 0 }} >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" className="dark:stroke-gray-600" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B7280", fontSize: 12, textAnchor: "start" }}
              className="dark:fill-gray-400"
              tickFormatter={(month) => month.slice(0, 3)}
              interval={0}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B7280", fontSize: 12 }}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
              label={{
                value: 'Revenue ($)',
                angle: -90,
                position: 'left',
                fill: '#6B7280',
                fontSize: 12,
                style: { textAnchor: 'middle' }
              }}
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
              formatter={(value: any) => [`$${value.toLocaleString()}`, 'Forecast']}
              labelFormatter={(label) => `Month: ${label}`}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#8B5CF6"
              strokeWidth={2}
              fill="url(#colorRevenue)"
              name="Forecast"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueGraph;
