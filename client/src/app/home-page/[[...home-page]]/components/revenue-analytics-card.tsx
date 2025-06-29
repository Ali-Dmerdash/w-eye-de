"use client"
import { useEffect, useState } from "react"
import { DollarSign, TrendingUp, CreditCard, Banknote, LineChart } from "lucide-react"

export default function RevenueAnalyticsCard() {
  // Monthly revenue data that correlates with the header stats
  const monthlyRevenue = [42000, 38000, 45000, 53000, 48000, 51000, 47000, 49000, 53000] // Last value matches "Today's Revenue"
  const maxValue = Math.max(...monthlyRevenue)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-purple-100 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
          <LineChart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue Analytics</h3>
          <div className="flex items-center gap-1">
            <span className="text-green-600 dark:text-green-400 text-sm font-medium">(+$15K)</span>
            <span className="text-gray-500 dark:text-gray-400 text-sm">vs last month</span>
          </div>
        </div>
      </div>

      <div className="h-48 flex relative mb-6 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400 pr-2 p-3">
          <span>$60K</span>
          <span>$48K</span>
          <span>$36K</span>
          <span>$24K</span>
          <span>$12K</span>
          <span>$0</span>
        </div>
        <div className="flex-1 flex items-end justify-between pl-12 pr-3 pb-3 pt-3 gap-1" style={{ height: "180px" }}>
          {monthlyRevenue.map((value, index) => {
            const heightPercentage = Math.max((value / maxValue) * 100, 5) // Minimum 5% height
            const heightInPixels = (heightPercentage / 100) * 160 // 160px is the available chart height
            return (
              <div
                key={index}
                className="flex flex-col items-center justify-end"
                style={{ height: "160px", width: "100%" }}
              >
                <div
                  style={{
                    height: `${heightInPixels}px`,
                    width: "20px",
                  }}
                  className={`bg-gradient-to-t from-purple-500 to-purple-600 rounded-t-md transition-all duration-1000 hover:from-purple-600 hover:to-purple-700 shadow-sm ${
                    mounted ? "opacity-100" : "opacity-0"
                  }`}
                  title={`$${(value / 1000).toFixed(0)}K`}
                />
                <span className="text-xs text-gray-400 mt-1 text-center">
                  {index === 8 ? "Today" : `M${index + 1}`}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-100 dark:border-green-800/30">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-green-500 rounded-lg">
              <DollarSign className="w-4 h-4 text-white" />
            </div>
            <span className="text-green-600 dark:text-green-400 text-sm font-medium">Revenue</span>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white">$173K</p>
          <div className="w-full h-1.5 bg-green-200 dark:bg-green-800 rounded-full mt-2">
            <div className="w-full h-full bg-green-500 rounded-full"></div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800/30">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-blue-500 rounded-lg">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">Growth</span>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white">+28%</p>
          <div className="w-full h-1.5 bg-blue-200 dark:bg-blue-800 rounded-full mt-2">
            <div className="w-3/4 h-full bg-blue-500 rounded-full"></div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-xl p-4 border border-purple-100 dark:border-purple-800/30">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-purple-500 rounded-lg">
              <CreditCard className="w-4 h-4 text-white" />
            </div>
            <span className="text-purple-600 dark:text-purple-400 text-sm font-medium">Payments</span>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white">1,247</p>
          <div className="w-full h-1.5 bg-purple-200 dark:bg-purple-800 rounded-full mt-2">
            <div className="w-4/5 h-full bg-purple-500 rounded-full"></div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl p-4 border border-orange-100 dark:border-orange-800/30">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-orange-500 rounded-lg">
              <Banknote className="w-4 h-4 text-white" />
            </div>
            <span className="text-orange-600 dark:text-orange-400 text-sm font-medium">Avg Order</span>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white">$139</p>
          <div className="w-full h-1.5 bg-orange-200 dark:bg-orange-800 rounded-full mt-2">
            <div className="w-3/5 h-full bg-orange-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
