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
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-purple-100 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <div className="flex items-baseline gap-3">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
            <span 
              className={`text-sm font-semibold px-2 py-1 rounded-full ${
                changeType === "positive" 
                  ? "text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30" 
                  : "text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30"
              }`}
            >
              {change}
            </span>
          </div>
        </div>
        <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
          {icon}
        </div>
      </div>
    </div>
  );
}

