"use client";
import type React from "react";

interface DashboardCardProps {
  title: string;
  value: string | number;
  change: string;
  changeType: "positive" | "negative";
  icon: React.ReactNode;
  iconBg: string;
}

export default function DashboardCard({ title, value, change, changeType, icon, iconBg }: DashboardCardProps) {
  return (
    <div className="font-mulish rounded-lg p-5 flex items-center justify-between bg-[#4B65AB] dark:bg-[#1d2328]">
      <div className="space-y-1">
        <p className="text-sm text-[#AEC3FF] dark:text-gray-400">{title}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-xl font-bold text-white">{value}</h3>
          <span className={`text-xs ${changeType === "positive" ? "text-green-500" : "text-red-500"}`}>{change}</span>
        </div>
      </div>
      <div className={`p-3 rounded-lg bg-gradient-to-b from-[#243461] to-[#4A6BC7] dark:from-[#243461] dark:to-[#15191c] flex items-center justify-center`}>{icon}</div>
    </div>
  );
}

