"use client"
import { RotateCcw, Shield, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useOnboarding } from "@/context/OnboardingContext"

export default function OnboardingHelpButton() {
  const { startOnboarding, startFraudOnboarding, resetOnboardingForTesting, currentPage } = useOnboarding()

  const handleStartTour = () => {
    if (currentPage === "fraud") {
      startFraudOnboarding()
    } else {
      startOnboarding()
    }
  }

  const getTourLabel = () => {
    return currentPage === "fraud" ? "Fraud Tour" : "Dashboard Tour"
  }

  const getTourIcon = () => {
    return currentPage === "fraud" ? <Shield className="w-4 h-4" /> : <Home className="w-4 h-4" />
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {/* Main Tour Button */}
      <Button
        onClick={handleStartTour}
        className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-full px-6 py-3"
        title={`Take a tour of the ${currentPage === "fraud" ? "fraud detection" : "dashboard"} features`}
      >
        {getTourIcon()}
        <span className="font-medium">{getTourLabel()}</span>
      </Button>

      {/* Reset button for testing - only show in development */}
      {process.env.NODE_ENV === "development" && (
        <Button
          variant="outline"
          size="sm"
          onClick={resetOnboardingForTesting}
          className="flex items-center gap-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm text-orange-600 border-orange-200 hover:bg-orange-50 dark:hover:bg-orange-900/20 shadow-md hover:shadow-lg transition-all duration-300 rounded-full px-4 py-2"
          title="Reset all onboarding for testing"
        >
          <RotateCcw className="w-3 h-3" />
          <span className="text-xs">Reset</span>
        </Button>
      )}
    </div>
  )
}
