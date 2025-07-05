"use client"

import { useState, useEffect } from "react"
import {KPIDashboard} from "@/app/sphere/kpi-dashboard"
import { KPISettingsPanel } from "@/app/sphere/kpi-settings-panel"
import { Button } from "@/components/ui/button"
import { Settings, RotateCcw, Maximize2, X, Palette } from "lucide-react"
import { useTheme } from "@/context/ThemeContext"
import { createPortal } from "react-dom"

export interface KPIData {
  id: number
  name: string
  value: string
  numericValue: number
  unit: string
  status: "good" | "warning" | "critical"
  importance: number
  relevanceToOverall: number
  description: string
  target?: number
  benchmark?: { good: number; warning: number }
  category: string
}

export const initialKPIs: KPIData[] = [
  {
    id: 1,
    name: "Revenue",
    value: "$400B",
    numericValue: 400,
    unit: "billion",
    status: "good",
    importance: 10,
    relevanceToOverall: 9,
    description: "Total annual sales (e.g., product, services)",
    benchmark: { good: 350, warning: 300 },
    category: "Financial",
  },
  {
    id: 2,
    name: "Net Profit Margin",
    value: "21.5%",
    numericValue: 21.5,
    unit: "percentage",
    status: "good",
    importance: 9,
    relevanceToOverall: 10,
    description: "For every $1 in sales, $0.215 is profit",
    benchmark: { good: 20, warning: 15 },
    category: "Financial",
  },
  {
    id: 3,
    name: "EBIT",
    value: "$95B",
    numericValue: 95,
    unit: "billion",
    status: "good",
    importance: 8,
    relevanceToOverall: 8,
    description: "Profit before tax and interest expenses",
    benchmark: { good: 80, warning: 60 },
    category: "Financial",
  },
  {
    id: 4,
    name: "Operating Cash Flow",
    value: "$120B",
    numericValue: 120,
    unit: "billion",
    status: "good",
    importance: 8,
    relevanceToOverall: 7,
    description: "Cash generated from core operations",
    benchmark: { good: 100, warning: 80 },
    category: "Financial",
  },
  {
    id: 5,
    name: "Return on Assets",
    value: "13.2%",
    numericValue: 13.2,
    unit: "percentage",
    status: "warning",
    importance: 7,
    relevanceToOverall: 6,
    description: "Each $1 in assets brings $0.132 profit",
    benchmark: { good: 15, warning: 10 },
    category: "Financial",
  },
  {
    id: 6,
    name: "Return on Equity",
    value: "45.6%",
    numericValue: 45.6,
    unit: "percentage",
    status: "good",
    importance: 7,
    relevanceToOverall: 8,
    description: "Very strong return for shareholders",
    benchmark: { good: 40, warning: 25 },
    category: "Financial",
  },
  {
    id: 7,
    name: "Debt-to-Equity Ratio",
    value: "0.65",
    numericValue: 0.65,
    unit: "ratio",
    status: "good",
    importance: 6,
    relevanceToOverall: 5,
    description: "$0.65 in debt for every $1 in equity (healthy level)",
    benchmark: { good: 0.7, warning: 1.0 },
    category: "Financial",
  },
  {
    id: 8,
    name: "Gross Profit Margin",
    value: "42%",
    numericValue: 42,
    unit: "percentage",
    status: "good",
    importance: 6,
    relevanceToOverall: 6,
    description: "After production costs, 42% of revenue remains",
    benchmark: { good: 40, warning: 30 },
    category: "Financial",
  },
  {
    id: 9,
    name: "Current Ratio",
    value: "1.6",
    numericValue: 1.6,
    unit: "ratio",
    status: "good",
    importance: 5,
    relevanceToOverall: 4,
    description: "Current assets are 1.6x liabilities—strong liquidity",
    benchmark: { good: 1.5, warning: 1.0 },
    category: "Financial",
  },
  {
    id: 10,
    name: "Earnings Per Share",
    value: "$6.30",
    numericValue: 6.3,
    unit: "dollars",
    status: "warning",
    importance: 5,
    relevanceToOverall: 7,
    description: "Each share earns $6.30 annually",
    benchmark: { good: 7, warning: 5 },
    category: "Financial",
  },
  {
    id: 11,
    name: "Customer Acquisition Cost",
    value: "$125",
    numericValue: 125,
    unit: "dollars",
    status: "good",
    importance: 8,
    relevanceToOverall: 8,
    description: "Average cost to acquire a new customer",
    benchmark: { good: 150, warning: 200 },
    category: "Customer",
  },
  {
    id: 12,
    name: "Customer Lifetime Value",
    value: "$2,400",
    numericValue: 2400,
    unit: "dollars",
    status: "good",
    importance: 9,
    relevanceToOverall: 9,
    description: "Total revenue expected from a customer over their lifetime",
    benchmark: { good: 2000, warning: 1500 },
    category: "Customer",
  },
  {
    id: 13,
    name: "Customer Retention Rate",
    value: "94%",
    numericValue: 94,
    unit: "percentage",
    status: "good",
    importance: 8,
    relevanceToOverall: 7,
    description: "Percentage of customers retained over a period",
    benchmark: { good: 90, warning: 80 },
    category: "Customer",
  },
  {
    id: 14,
    name: "Market Share",
    value: "18.5%",
    numericValue: 18.5,
    unit: "percentage",
    status: "good",
    importance: 7,
    relevanceToOverall: 6,
    description: "Company's share of the total market",
    benchmark: { good: 15, warning: 10 },
    category: "Market",
  },
  {
    id: 15,
    name: "Employee Productivity",
    value: "$285K",
    numericValue: 285,
    unit: "thousands",
    status: "good",
    importance: 6,
    relevanceToOverall: 5,
    description: "Revenue per employee annually",
    benchmark: { good: 250, warning: 200 },
    category: "Operations",
  },
  {
    id: 16,
    name: "Inventory Turnover",
    value: "8.2x",
    numericValue: 8.2,
    unit: "times",
    status: "good",
    importance: 6,
    relevanceToOverall: 4,
    description: "How many times inventory is sold and replaced",
    benchmark: { good: 7, warning: 5 },
    category: "Operations",
  },
  {
    id: 17,
    name: "Working Capital Ratio",
    value: "2.1",
    numericValue: 2.1,
    unit: "ratio",
    status: "good",
    importance: 5,
    relevanceToOverall: 4,
    description: "Company's ability to pay short-term obligations",
    benchmark: { good: 1.8, warning: 1.2 },
    category: "Financial",
  },
  {
    id: 18,
    name: "Brand Awareness",
    value: "76%",
    numericValue: 76,
    unit: "percentage",
    status: "good",
    importance: 6,
    relevanceToOverall: 5,
    description: "Percentage of target market aware of the brand",
    benchmark: { good: 70, warning: 50 },
    category: "Marketing",
  },
  {
    id: 19,
    name: "Digital Engagement Rate",
    value: "12.8%",
    numericValue: 12.8,
    unit: "percentage",
    status: "warning",
    importance: 5,
    relevanceToOverall: 3,
    description: "User engagement across digital platforms",
    benchmark: { good: 15, warning: 10 },
    category: "Marketing",
  },
  {
    id: 20,
    name: "Innovation Index",
    value: "8.4",
    numericValue: 8.4,
    unit: "score",
    status: "good",
    importance: 7,
    relevanceToOverall: 6,
    description: "Company's innovation capability score (1-10)",
    benchmark: { good: 8, warning: 6 },
    category: "Innovation",
  },
]

// Add function to calculate status automatically
export const calculateKPIStatus = (kpi: KPIData): "good" | "warning" | "critical" => {
  
  if (!kpi.benchmark) return "good"

  const { numericValue } = kpi
  const { good, warning } = kpi.benchmark

  // For debt-to-equity ratio and CAC, lower is better
  if (kpi.name === "Debt-to-Equity Ratio" || kpi.name === "Customer Acquisition Cost") {
    if (numericValue <= good) return "good"
    if (numericValue <= warning) return "warning"
    return "critical"
  }

  // For most KPIs, higher is better
  if (numericValue >= good) return "good"
  if (numericValue >= warning) return "warning"
  return "critical"
}

// Update KPIs with calculated status
const kpisWithCalculatedStatus = initialKPIs.map((kpi) => ({
  ...kpi,
  status: calculateKPIStatus(kpi),
}))

export default function Home() {
  const [kpis, setKPIs] = useState<KPIData[]>(kpisWithCalculatedStatus)
  const [showSettings, setShowSettings] = useState(false)
  const [resetTrigger, setResetTrigger] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)
  const [styleMode, setStyleMode] = useState<"wireframe" | "minimal" | "neon" | "glass">("wireframe")
  const { theme } = useTheme()

  const updateKPIImportance = (id: number, importance: number) => {
    setKPIs((prev) => prev.map((kpi) => (kpi.id === id ? { ...kpi, importance } : kpi)))
  }

  const updateKPIRelevance = (id: number, relevance: number) => {
    setKPIs((prev) => prev.map((kpi) => (kpi.id === id ? { ...kpi, relevanceToOverall: relevance } : kpi)))
  }

  const resetRotation = () => {
    setResetTrigger((prev) => prev + 1)
  }

  const cycleStyleMode = () => {
    const modes: ("wireframe" | "minimal" | "neon" | "glass")[] = ["wireframe", "minimal", "neon", "glass"]
    const currentIndex = modes.indexOf(styleMode)
    const nextIndex = (currentIndex + 1) % modes.length
    setStyleMode(modes[nextIndex])
  }

  const overallStatus = () => {
    const goodCount = kpis.filter((kpi) => kpi.status === "good").length
    const warningCount = kpis.filter((kpi) => kpi.status === "warning").length
    const criticalCount = kpis.filter((kpi) => kpi.status === "critical").length

    if (criticalCount > 0) return "critical"
    if (warningCount > goodCount / 2) return "warning"
    return "good"
  }

  const getKPIStats = () => {
    const total = kpis.length
    const good = kpis.filter((kpi) => kpi.status === "good").length
    const warning = kpis.filter((kpi) => kpi.status === "warning").length
    const critical = kpis.filter((kpi) => kpi.status === "critical").length
    return { total, good, warning, critical }
  }

  const stats = getKPIStats()

  // Handle Esc to exit fullscreen
  useEffect(() => {
    if (!fullscreen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreen(false)
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [fullscreen])

  

  return (
    <div className="min-h-screen bg-transparent">
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <Button
          onClick={() => setFullscreen(true)}
          variant="outline"
          size="sm"
          className="bg-background/80 backdrop-blur-sm border-border"
        >
          <Maximize2 className="w-4 h-4 mr-2" />
          Fullscreen
        </Button>

        <Button
          onClick={() => setShowSettings(!showSettings)}
          variant="outline"
          size="sm"
          className="bg-background/80 backdrop-blur-sm border-border"
        >
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>

        <Button
          onClick={resetRotation}
          variant="outline"
          size="sm"
          className="bg-background/80 backdrop-blur-sm border-border"
        >
          <RotateCcw className="w-8 h-8 mr-2" />
          Reset View
        </Button>
      </div>

      <div className="absolute top-4 right-4 z-10 flex gap-2 items-center">
        <div
          className="bg-background/80 backdrop-blur-sm rounded-lg p-4 border border-border text-foreground shadow-sm"
        >
          <h3 className="text-sm font-medium mb-2">Overall Status</h3>
          <div
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mb-3 ${
              overallStatus() === "good"
                ? "bg-green-500/20 text-green-700 dark:text-green-300"
                : overallStatus() === "warning"
                  ? "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300"
                  : "bg-red-500/20 text-red-700 dark:text-red-300"
            }`}
          >
            {overallStatus() === "good"
              ? "● Excellent"
              : overallStatus() === "warning"
                ? "● Needs Attention"
                : "● Critical"}
          </div>
          <div className="text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total KPIs:</span>
              <span className="font-medium">{stats.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-600 dark:text-green-400">Good:</span>
              <span className="font-medium">{stats.good}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-yellow-600 dark:text-yellow-400">Warning:</span>
              <span className="font-medium">{stats.warning}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-red-600 dark:text-red-400">Critical:</span>
              <span className="font-medium">{stats.critical}</span>
            </div>
          </div>
        </div>
      </div>

      <KPIDashboard
        kpis={kpis}
        overallStatus={overallStatus()}
        resetTrigger={resetTrigger}
        envPreset={theme === "dark" ? "night" : "city"}
        styleMode={styleMode}
      />

      {fullscreen &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[100] bg-transparent flex flex-col items-center justify-center transition-all duration-500 animate-fade-in">
          <button
            onClick={() => setFullscreen(false)}
              className="absolute top-4 right-4 p-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border text-foreground transition-colors z-10"
            title="Exit Fullscreen"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="w-full h-full flex-1">
              <KPIDashboard
                kpis={kpis}
                overallStatus={overallStatus()}
                resetTrigger={resetTrigger}
                envPreset={theme === "dark" ? "night" : "city"}
                styleMode={styleMode}
              />
          </div>
        </div>,
          document.body,
      )}

      {showSettings && (
        <KPISettingsPanel
          kpis={kpis}
          onUpdateImportance={updateKPIImportance}
          onUpdateRelevance={updateKPIRelevance}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}
