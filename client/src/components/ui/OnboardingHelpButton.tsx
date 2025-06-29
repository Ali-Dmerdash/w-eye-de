"use client"
import { Shield, Home, BarChart3, TrendingUp, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useOnboarding } from "@/context/OnboardingContext"

export default function OnboardingHelpButton() {
  const {
    startOnboarding,
    startFraudOnboarding,
    startStatisticsOnboarding,
    startMarketOnboarding,
    startRevenueOnboarding,
    currentPage,
  } = useOnboarding()

  const handleStartTour = () => {
    if (currentPage === "fraud") {
      startFraudOnboarding()
    } else if (currentPage === "statistics") {
      startStatisticsOnboarding()
    } else if (currentPage === "market") {
      startMarketOnboarding()
    } else if (currentPage === "revenue") {
      startRevenueOnboarding()
    } else {
      startOnboarding()
    }
  }

  const getIcon = () => {
    switch (currentPage) {
      case "fraud":
        return <Shield className="w-4 h-4" />
      case "statistics":
        return <BarChart3 className="w-4 h-4" />
      case "market":
        return <TrendingUp className="w-4 h-4" />
      case "revenue":
        return <DollarSign className="w-4 h-4" />
      default:
        return <Home className="w-4 h-4" />
    }
  }

  const getTitle = () => {
    switch (currentPage) {
      case "fraud":
        return "fraud detection"
      case "statistics":
        return "analytics"
      case "market":
        return "market analysis"
      case "revenue":
        return "revenue dashboard"
      default:
        return "dashboard"
    }
  }

  return (
    <Button
      onClick={handleStartTour}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-xl rounded-full px-4 py-2 transition-all duration-300 hover:scale-105 hover:shadow-2xl backdrop-blur-sm border border-purple-500/20"
      title={`Start ${getTitle()} tour`}
    >
      {getIcon()}
      <span className="text-sm font-medium">Tour</span>
    </Button>
  )
}
