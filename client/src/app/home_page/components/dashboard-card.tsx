import type React from "react"

interface DashboardCardProps {
  title: string
  value: string
  change: string
  changeType: "positive" | "negative"
  icon: React.ReactNode
  iconBg: string
}

export default function DashboardCard({ title, value, change, changeType, icon, iconBg }: DashboardCardProps) {
  return (
    <div className="font-mulish bg-[#1d2328] rounded-lg p-5 flex items-center justify-between">
      <div className="space-y-1">
        <p className="text-sm text-gray-400">{title}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-xl font-bold text-white">{value}</h3>
          <span className={`text-xs ${changeType === "positive" ? "text-green-500" : "text-red-500"}`}>{change}</span>
        </div>
      </div>
      <div className={`p-3 rounded-lg ${iconBg} flex items-center justify-center`}>{icon}</div>
    </div>
  )
}

