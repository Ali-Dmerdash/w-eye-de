"use client"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp, BarChart3 } from "lucide-react"

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

export default function SalesOverview() {
  return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-purple-100 dark:border-gray-700 p-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Sales Overview</h2>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">+5% more in 2024</p>
            </div>
          </div>
          {(() => {
          const now = new Date();
          const year = now.getFullYear();
          const month = now.getMonth(); // 0-based
          let quarter = 1;
          if (month >= 0 && month <= 2) quarter = 1;
          else if (month >= 3 && month <= 5) quarter = 2;
          else if (month >= 6 && month <= 8) quarter = 3;
          else if (month >= 9 && month <= 11) quarter = 4;
          return (
            <div className="bg-purple-50 dark:bg-purple-900/20 px-3 py-1 rounded-full">
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                {`Q${quarter} ${year}`}
              </span>
            </div>
          );
        })()}
        </div>

        {/* Chart */}
        <div className="flex-grow">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorValue2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#A78BFA" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#A78BFA" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" className="dark:stroke-gray-600" />
              <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                  className="dark:fill-gray-400"
              />
              <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6B7280", fontSize: 12 }}
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
                  dataKey="value1"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  fill="url(#colorValue1)"
                  name="Primary Sales"
              />
              <Area
                  type="monotone"
                  dataKey="value2"
                  stroke="#A78BFA"
                  strokeWidth={2}
                  fill="url(#colorValue2)"
                  name="Secondary Sales"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
  )
}
