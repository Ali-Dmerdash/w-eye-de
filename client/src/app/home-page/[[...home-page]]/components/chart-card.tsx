"use client"
import { useEffect, useState } from "react"
import { Users, ThumbsUp, DollarSign, ShoppingBag } from "lucide-react"

export default function ChartCard() {
  const data = [340, 250, 160, 330, 410, 380, 340, 220, 160]
  const maxValue = Math.max(...data)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="font-mulish rounded-lg p-6 bg-[#4B65AB] dark:bg-[#1d2328]">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-white">Active Users</h3>
        <div className="flex items-center">
          <span className="text-green-500 text-sm">(+23)</span>
          <span className="text-gray-400 text-sm ml-1">than last week</span>
        </div>
      </div>
      <div className="h-48 flex relative mb-6 border-b border-gray-700 pb-4 bg-[#E4E7F6] dark:bg-[#1B2131] rounded-xl">
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-400 pr-2 p-3 text-[#4B65AB] dark:text-gray-400">
          <span>500</span>
          <span>400</span>
          <span>300</span>
          <span>200</span>
          <span>100</span>
          <span>0</span>
        </div>
        <div className="flex-1 flex items-end justify-between pl-8 p-3 text-[#4B65AB] dark:text-[#E4E5F1]">
          {mounted &&
            data.map((value, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  style={{
                    height: `${(value / maxValue) * 100}%`,
                    width: "8px",
                    backgroundColor: "#fff",
                    borderRadius: "4px",
                  }}
                  className="transition-all duration-300 hover:bg-blue-400"
                />
              </div>
            ))}
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4 mt-8">
        <div className="space-y-1">
          <div className="flex items-center">
            <div className="bg-blue-500 p-1 rounded mr-2">
              <Users className="w-4 h-4 text-white" />
            </div>
            <span className="text-gray-400 text-sm">Users</span>
          </div>
          <p className="text-white font-medium">32,984</p>
          <div className="w-full h-1 bg-blue-500 rounded-full"></div>
        </div>
        <div className="space-y-1">
          <div className="flex items-center">
            <div className="bg-blue-500 p-1 rounded mr-2">
              <ThumbsUp className="w-4 h-4 text-white" />
            </div>
            <span className="text-gray-400 text-sm">Clicks</span>
          </div>
          <p className="text-white font-medium">2.42m</p>
          <div className="w-full h-1 bg-blue-500 rounded-full"></div>
        </div>
        <div className="space-y-1">
          <div className="flex items-center">
            <div className="bg-blue-500 p-1 rounded mr-2">
              <DollarSign className="w-4 h-4 text-white" />
            </div>
            <span className="text-gray-400 text-sm">Sales</span>
          </div>
          <p className="text-white font-medium">2,400$</p>
          <div className="w-full h-1 bg-blue-500 rounded-full"></div>
        </div>
        <div className="space-y-1">
          <div className="flex items-center">
            <div className="bg-blue-500 p-1 rounded mr-2">
              <ShoppingBag className="w-4 h-4 text-white" />
            </div>
            <span className="text-gray-400 text-sm">Items</span>
          </div>
          <p className="text-white font-medium">320</p>
          <div className="w-full h-1 bg-blue-500 rounded-full"></div>
        </div>
      </div>
    </div>
  )
}

