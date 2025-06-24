"use client"
import React, { useEffect } from "react"
import { BarChart, TrendingUp, Target, Zap } from "lucide-react"
import type { RevenueKeyFactors } from "@/state/type"

// Define props for KeyFactorsCard
interface KeyFactorsCardProps {
    keyFactorsData: RevenueKeyFactors | undefined | null
}



const KeyFactorsCard: React.FC<KeyFactorsCardProps> = ({ keyFactorsData }) => {


    const formatLabel = (label: string): string => {
        let result = label.replace(/([A-Z])/g, " $1")
        result = result.replace(/^\s+/, "")
        return result.charAt(0).toUpperCase() + result.slice(1)
    }

    const getFactorIcon = (index: number) => {
        const icons = [<Target key="target" />, <TrendingUp key="trending" />, <Zap key="zap" />, <BarChart key="chart" />]
        return icons[index % icons.length]
    }

    const getLevelColor = (level: string) => {
        switch (level) {
            case "High Positive":
                return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
            case "Moderate Positive":
                return "bg-yellow-50 text-yellow-600 dark:bg-yellow-900/10 dark:text-yellow-300";
            case "Low Positive":
                return "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/10 dark:text-emerald-300";
            case "High Negative":
                return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
            case "Moderate Negative":
                return "bg-orange-50 text-orange-600 dark:bg-orange-900/10 dark:text-orange-300";
            case "Low Negative":
                return "bg-red-50 text-red-600 dark:bg-red-900/10 dark:text-red-300";
            default:
                return "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-300";
        }
    }

    if (!keyFactorsData) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-purple-100 dark:border-gray-700 p-6 h-full">
                <div className="animate-pulse">
                    {/* Header skeleton */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-gray-700 rounded-lg"></div>
                        <div className="h-6 w-32 bg-purple-100 dark:bg-gray-700 rounded"></div>
                    </div>

                    {/* Grid skeleton */}
                    <div className="grid grid-cols-1 gap-4">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <div
                                key={index}
                                className="p-4 bg-purple-50 dark:bg-gray-700/50 rounded-xl border border-purple-100 dark:border-gray-600"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-purple-100 dark:bg-gray-600 rounded-lg"></div>
                                        <div className="h-4 w-32 bg-purple-100 dark:bg-gray-600 rounded"></div>
                                    </div>
                                    <div className="h-6 w-16 bg-purple-200 dark:bg-gray-600 rounded-full"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    const entries = Object.entries(keyFactorsData)

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-purple-100 dark:border-gray-700 p-6 h-full ">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <BarChart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Key Factors</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Revenue impact analysis</p>
                </div>
            </div>

            {/* Factors Grid */}
            <div className="space-y-4 overflow-y-auto max-h-[40vh] custom-scrollbar">
                {entries.map(([key, value], index) => {
                    const [score = "", level = ""] = value.split("/").map((s) => s.trim())
                    const formattedKey = formatLabel(key)

                    return (
                        <div
                            key={key}
                            className="
                            flex items-center justify-between flex-col gap-3 p-4 bg-purple-50 dark:bg-gray-700/50 rounded-xl border border-purple-100 dark:border-gray-600 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-400">
                                        {React.cloneElement(getFactorIcon(index), { className: "w-4 h-4" })}
                                    </div>
                                    <div className="flex flex-col items-start  gap-2">
                                        <h3 className="text-sm text-gray-900 dark:text-white">{formattedKey}</h3>
                                    </div>
                                </div>

                            </div>
                            <div className={`px-3 py-1 rounded-full w-fit text-xs text-center ${getLevelColor(score)}`}>{score}</div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default KeyFactorsCard
