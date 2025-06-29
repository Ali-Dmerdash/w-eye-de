"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface OnboardingStep {
  id: string
  title: string
  description: string
  target: string
  position: "top" | "bottom" | "left" | "right" | "center"
}

interface OnboardingContextType {
  isOnboardingActive: boolean
  currentStep: number
  steps: OnboardingStep[]
  startOnboarding: () => void
  nextStep: () => void
  prevStep: () => void
  skipOnboarding: () => void
  startFraudOnboarding: () => void
  startStatisticsOnboarding: () => void
  startMarketOnboarding: () => void
  startRevenueOnboarding: () => void
  currentPage: "home" | "fraud" | "statistics" | "market" | "revenue"
  setCurrentPage: (page: "home" | "fraud" | "statistics" | "market" | "revenue") => void
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

// Streamlined onboarding steps
const homeSteps: OnboardingStep[] = [
  {
    id: "welcome",
    title: "Welcome to Your Dashboard!",
    description: "Let's take a quick tour of your dashboard features.",
    target: "body",
    position: "center",
  },
  {
    id: "sidebar",
    title: "Navigation Sidebar",
    description: "Access different sections and collapse/expand with the eye icon.",
    target: "#sidebar",
    position: "right",
  },
  {
    id: "ai-assistant",
    title: "AI Assistant",
    description: "Your intelligent assistant for questions and insights.",
    target: '[data-onboarding="ai-assistant"]',
    position: "bottom",
  },
  {
    id: "notifications",
    title: "Notifications",
    description: "Stay updated with alerts and system updates.",
    target: '[data-onboarding="notifications"]',
    position: "bottom",
  },
  {
    id: "stats",
    title: "Key Metrics",
    description: "Your most important business metrics at a glance.",
    target: '[data-onboarding="stats-cards"]',
    position: "bottom",
  },
  {
    id: "welcome-card",
    title: "Personal Welcome",
    description: "Your personalized dashboard area.",
    target: '[data-onboarding="welcome-card"]',
    position: "bottom",
  },
  {
    id: "chart",
    title: "Analytics",
    description: "Interactive charts and data insights.",
    target: '[data-onboarding="chart-card"]',
    position: "top",
  },
  {
    id: "kpi",
    title: "3D KPI Dashboard",
    description: "Interactive 3D visualization of your KPIs.",
    target: '[data-onboarding="kpi-dashboard"]',
    position: "left",
  },
]

const fraudSteps: OnboardingStep[] = [
  {
    id: "fraud-welcome",
    title: "Fraud Detection Dashboard",
    description: "Monitor and analyze fraudulent activities.",
    target: "body",
    position: "center",
  },
  {
    id: "transaction-analysis",
    title: "Transaction Analysis",
    description: "Real-time fraud vs legitimate transaction monitoring.",
    target: '[data-onboarding="transaction-analysis"]',
    position: "bottom",
  },
  {
    id: "fraud-metrics",
    title: "Fraud Metrics",
    description: "Current fraud rates and pattern identification.",
    target: '[data-onboarding="fraud-metrics"]',
    position: "left",
  },
  {
    id: "transaction-table",
    title: "Transaction Data",
    description: "Detailed transaction view with fraud risk scores.",
    target: '[data-onboarding="transaction-table"]',
    position: "top",
  },
  {
    id: "ai-analysis",
    title: "AI Analysis",
    description: "Intelligent fraud insights and recommendations.",
    target: '[data-onboarding="ai-analysis"]',
    position: "left",
  },
]

const statisticsSteps: OnboardingStep[] = [
  {
    id: "statistics-welcome",
    title: "Analytics Dashboard Overview",
    description: "Welcome to your comprehensive analytics dashboard with detailed business insights.",
    target: "body",
    position: "center",
  },
  {
    id: "performance-overview",
    title: "Performance Summary",
    description: "Your key business metrics and performance indicators at the top of the dashboard.",
    target: '[data-onboarding="performance-overview"]',
    position: "bottom",
  },
  {
    id: "revenue-analytics",
    title: "Revenue Analytics Row",
    description: "Revenue and expenses analysis with area charts, line charts, and monthly breakdowns.",
    target: '[data-onboarding="row1-analytics"]',
    position: "bottom",
  },
  {
    id: "operational-insights",
    title: "Operational Insights Row",
    description: "Operational vs non-operational expenses, campaign targets, and product price analysis.",
    target: '[data-onboarding="row2-analytics"]',
    position: "bottom",
  },
  {
    id: "detailed-reports",
    title: "Detailed Reports Row",
    description: "Recent transactions, monthly comparisons, expense breakdowns, and comprehensive reporting.",
    target: '[data-onboarding="row3-analytics"]',
    position: "top",
  },
]

const marketSteps: OnboardingStep[] = [
  {
    id: "market-welcome",
    title: "Market Analysis Dashboard",
    description: "Welcome to your comprehensive market intelligence and competitive analysis platform.",
    target: "body",
    position: "center",
  },
  {
    id: "download-report",
    title: "Export & Reports",
    description: "Download comprehensive market analysis reports and export data for presentations.",
    target: '[data-onboarding="download-report"]',
    position: "bottom",
  },
  {
    id: "pricing-analysis",
    title: "Pricing Comparison",
    description: "Analyze competitor pricing strategies and position your products competitively in the market.",
    target: '[data-onboarding="pricing-comparison"]',
    position: "right",
  },
  {
    id: "swot-analysis",
    title: "SWOT Analysis Matrix",
    description: "Comprehensive Strengths, Weaknesses, Opportunities, and Threats analysis for strategic planning.",
    target: '[data-onboarding="swot-analysis"]',
    position: "bottom",
  },
  {
    id: "competitive-positioning",
    title: "Competitive Positioning",
    description: "Visualize your market position relative to competitors and identify strategic opportunities.",
    target: '[data-onboarding="competitive-positioning"]',
    position: "left",
  },
  {
    id: "market-map",
    title: "Market Landscape",
    description: "Interactive market map showing industry trends, market segments, and growth opportunities.",
    target: '[data-onboarding="market-map"]',
    position: "top",
  },
  {
    id: "ai-insights",
    title: "AI-Powered Analysis",
    description: "Advanced AI insights and recommendations based on market data and competitive intelligence.",
    target: '[data-onboarding="ai-analysis"]',
    position: "top",
  },
]

const revenueSteps: OnboardingStep[] = [
  {
    id: "revenue-welcome",
    title: "Revenue Dashboard Overview",
    description: "Welcome to your comprehensive revenue analytics dashboard with real-time insights and forecasting.",
    target: "body",
    position: "center",
  },
  {
    id: "revenue-header",
    title: "Dashboard Header & Controls",
    description:
      "Access revenue reports, download data, and monitor key performance indicators from the header section.",
    target: '[data-onboarding="revenue-header"]',
    position: "bottom",
  },
  {
    id: "revenue-forecast-chart",
    title: "Revenue Forecast Confidence",
    description:
      "Circular progress chart showing revenue forecast accuracy with confidence levels (High, Medium, Low).",
    target: '[data-onboarding="revenue-forecast-chart"]',
    position: "right",
  },
  {
    id: "monthly-forecast-graph",
    title: "Monthly Revenue Forecast",
    description: "Interactive area chart displaying monthly revenue projections with quarterly filtering options.",
    target: '[data-onboarding="monthly-forecast-graph"]',
    position: "left",
  },
  {
    id: "key-factors-analysis",
    title: "Revenue Key Factors",
    description: "Analyze critical factors impacting revenue performance with positive/negative impact indicators.",
    target: '[data-onboarding="key-factors-analysis"]',
    position: "right",
  },
  {
    id: "ai-revenue-analysis",
    title: "AI Revenue Insights",
    description:
      "Advanced AI-powered analysis providing actionable insights and strategic recommendations for revenue growth.",
    target: '[data-onboarding="ai-revenue-analysis"]',
    position: "left",
  },
]

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [isOnboardingActive, setIsOnboardingActive] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [currentPage, setCurrentPage] = useState<"home" | "fraud" | "statistics" | "market" | "revenue">("home")

  const steps =
    currentPage === "home"
      ? homeSteps
      : currentPage === "fraud"
        ? fraudSteps
        : currentPage === "statistics"
          ? statisticsSteps
          : currentPage === "market"
            ? marketSteps
            : revenueSteps

  useEffect(() => {
    const completed = localStorage.getItem(`${currentPage}-onboarding-completed`)
    if (!completed) {
      const timer = setTimeout(() => setIsOnboardingActive(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [currentPage])

  const startOnboarding = () => {
    setCurrentStep(0)
    setIsOnboardingActive(true)
  }

  const startFraudOnboarding = () => {
    setCurrentPage("fraud")
    setCurrentStep(0)
    setIsOnboardingActive(true)
  }

  const startStatisticsOnboarding = () => {
    setCurrentPage("statistics")
    setCurrentStep(0)
    setIsOnboardingActive(true)
  }

  const startMarketOnboarding = () => {
    setCurrentPage("market")
    setCurrentStep(0)
    setIsOnboardingActive(true)
  }

  const startRevenueOnboarding = () => {
    setCurrentPage("revenue")
    setCurrentStep(0)
    setIsOnboardingActive(true)
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      skipOnboarding()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const skipOnboarding = () => {
    setIsOnboardingActive(false)
    localStorage.setItem(`${currentPage}-onboarding-completed`, "true")
  }

  return (
    <OnboardingContext.Provider
      value={{
        isOnboardingActive,
        currentStep,
        steps,
        startOnboarding,
        nextStep,
        prevStep,
        skipOnboarding,
        startFraudOnboarding,
        startStatisticsOnboarding,
        startMarketOnboarding,
        startRevenueOnboarding,
        currentPage,
        setCurrentPage,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (!context) {
    throw new Error("useOnboarding must be used within an OnboardingProvider")
  }
  return context
}
