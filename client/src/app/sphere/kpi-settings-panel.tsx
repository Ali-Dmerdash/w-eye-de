"use client"

import { useState } from "react"
import type { KPIData } from "./page"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/app/sphere/ui/slider"
import { Badge } from "@/app/sphere/ui/badge"
import { X, TrendingUp, AlertTriangle, AlertCircle } from "lucide-react"
import { useTheme } from "@/context/ThemeContext"

interface KPISettingsPanelProps {
  kpis: KPIData[]
  onUpdateImportance: (id: number, importance: number) => void
  onUpdateRelevance: (id: number, relevance: number) => void
  onClose: () => void
}

export function KPISettingsPanel({ kpis, onUpdateImportance, onUpdateRelevance, onClose }: KPISettingsPanelProps) {
  const [selectedKPI, setSelectedKPI] = useState<number | null>(null)
  const [filterCategory, setFilterCategory] = useState<string>("All")
  const { theme } = useTheme();

  const categories = ["All", ...Array.from(new Set(kpis.map((kpi) => kpi.category)))]
  const filteredKPIs = filterCategory === "All" ? kpis : kpis.filter((kpi) => kpi.category === filterCategory)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good":
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case "critical":
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return theme === "dark" 
          ? "bg-green-500/20 text-green-300 border-green-500/30"
          : "bg-green-500/20 text-green-700 border-green-500/30"
      case "warning":
        return theme === "dark"
          ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
          : "bg-yellow-500/20 text-yellow-700 border-yellow-500/30"
      case "critical":
        return theme === "dark"
          ? "bg-red-500/20 text-red-300 border-red-500/30"
          : "bg-red-500/20 text-red-700 border-red-500/30"
      default:
        return theme === "dark"
          ? "bg-gray-500/20 text-gray-300 border-gray-500/30"
          : "bg-gray-500/20 text-gray-700 border-gray-500/30"
    }
  }

  const getCategoryColor = (category: string) => {
    const darkColors = {
      Financial: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      Customer: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      Market: "bg-orange-500/20 text-orange-300 border-orange-500/30",
      Operations: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
      Marketing: "bg-pink-500/20 text-pink-300 border-pink-500/30",
      Innovation: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    }
    
    const lightColors = {
      Financial: "bg-blue-500/20 text-blue-700 border-blue-500/30",
      Customer: "bg-purple-500/20 text-purple-700 border-purple-500/30",
      Market: "bg-orange-500/20 text-orange-700 border-orange-500/30",
      Operations: "bg-cyan-500/20 text-cyan-700 border-cyan-500/30",
      Marketing: "bg-pink-500/20 text-pink-700 border-pink-500/30",
      Innovation: "bg-emerald-500/20 text-emerald-700 border-emerald-500/30",
    }
    
    const colors = theme === "dark" ? darkColors : lightColors;
    return colors[category as keyof typeof colors] || (theme === "dark" 
      ? "bg-gray-500/20 text-gray-300 border-gray-500/30"
      : "bg-gray-500/20 text-gray-700 border-gray-500/30")
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000] flex items-center justify-center p-4 overflow-y-auto">
      <Card className={`w-full max-w-5xl max-h-[90vh] overflow-hidden ${theme === "dark" 
        ? "bg-gray-800/95 border-gray-700 text-white shadow-xl" 
        : "bg-white/95 border-gray-200 text-gray-900 shadow-xl"}`}>
        <CardHeader className="flex flex-row items-center justify-between sticky top-0 z-10 backdrop-blur-sm border-b border-opacity-20 pb-4">
          <div>
            <CardTitle className={theme === "dark" ? "text-white" : "text-gray-900"}>KPI Settings</CardTitle>
            <p className={`text-sm mt-1 ${theme === "dark" ? "text-gray-300" : "text-gray-500"}`}>
              Manage {kpis.length} KPIs across {categories.length - 1} categories
            </p>
          </div>
          <Button 
            onClick={onClose}
            variant="ghost" 
            size="sm"
            className={`rounded-full h-8 w-8 p-0 flex items-center justify-center ${theme === "dark" 
              ? "bg-gray-700 hover:bg-gray-600 text-white" 
              : "bg-gray-100 hover:bg-gray-200 text-gray-800"
            }`}
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="overflow-y-auto max-h-[calc(90vh-140px)] p-6 dark:custom-scrollbar">
          {/* Category Filter */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 border-b border-opacity-20 pb-4">
              {categories.map((category) => (
                <Button
                  key={category}
                  onClick={() => setFilterCategory(category)}
                  variant={filterCategory === category ? "default" : "outline"}
                  size="sm"
                  className={
                    filterCategory === category
                      ? theme === "dark"
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                      : theme === "dark"
                        ? "border-gray-700 text-white hover:bg-gray-700"
                        : "border-gray-200 text-gray-900 hover:bg-gray-100"
                  }
                >
                  {category}
                  {category !== "All" && (
                    <span className="ml-1 text-xs">({kpis.filter((kpi) => kpi.category === category).length})</span>
                  )}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredKPIs.map((kpi) => (
              <div
                key={kpi.id}
                className={`p-4 rounded-lg border transition-all cursor-pointer ${
                  selectedKPI === kpi.id
                    ? theme === "dark" 
                      ? "bg-gray-700/80 border-blue-600/50"
                      : "bg-gray-100/80 border-blue-600/50"
                    : theme === "dark"
                      ? "bg-gray-800/50 border-gray-700 hover:bg-gray-700/50"
                      : "bg-white/50 border-gray-200 hover:bg-gray-100/50"
                }`}
                onClick={() => setSelectedKPI(selectedKPI === kpi.id ? null : kpi.id)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-medium ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}>#{kpi.id}</span>
                    <h3 className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{kpi.name}</h3>
                    <Badge variant="outline" className={getCategoryColor(kpi.category)}>
                      {kpi.category}
                    </Badge>
                    <Badge variant="outline" className={getStatusColor(kpi.status)}>
                      {getStatusIcon(kpi.status)}
                      <span className="ml-1 capitalize">{kpi.status}</span>
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{kpi.value}</div>
                    <div className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                      I: {kpi.importance}/10 | R: {kpi.relevanceToOverall}/10
                    </div>
                  </div>
                </div>

                <p className={`text-sm mb-3 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>{kpi.description}</p>

                {selectedKPI === kpi.id && (
                  <div className={`space-y-4 pt-3 border-t ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                        Importance Level: {kpi.importance}/10
                      </label>
                      <Slider
                        value={[kpi.importance]}
                        onValueChange={(value) => onUpdateImportance(kpi.id, value[0])}
                        max={10}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      <div className={`flex justify-between text-xs mt-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                        <span>Low Impact</span>
                        <span>High Impact</span>
                      </div>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                        Relevance to Overall Status: {kpi.relevanceToOverall}/10
                      </label>
                      <Slider
                        value={[kpi.relevanceToOverall]}
                        onValueChange={(value) => onUpdateRelevance(kpi.id, value[0])}
                        max={10}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      <div className={`flex justify-between text-xs mt-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                        <span>Less Relevant (Further)</span>
                        <span>More Relevant (Closer)</span>
                      </div>
                      <p className={`text-xs mt-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                        Higher relevance places the KPI closer to the center sphere
                      </p>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Status (Auto-calculated)</label>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            kpi.status === "good"
                              ? "bg-green-400"
                              : kpi.status === "warning"
                                ? "bg-yellow-400"
                                : "bg-red-400"
                          }`}
                        />
                        <span className={`text-sm capitalize ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{kpi.status}</span>
                        <span className={`text-xs ml-2 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                          Based on benchmark:{" "}
                          {kpi.benchmark
                            ? `Good: ${kpi.benchmark.good}${kpi.unit === "percentage" ? "%" : ""}, Warning: ${kpi.benchmark.warning}${kpi.unit === "percentage" ? "%" : ""}`
                            : "No benchmark set"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
