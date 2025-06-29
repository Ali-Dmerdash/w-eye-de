"use client"
import { useEffect, useState } from "react"
import Sidebar from "@/components/ui/Sidebar"
import CompetitivePositioning from "./components/competitivePositioning"
import Strengths from "./components/strengths"
import Weaknesses from "./components/weaknesses"
import Opportunities from "./components/opportunities"
import Threats from "./components/threats"
import PricingComparison from "./components/pricingComparison"
import MarketMap from "./components/marketMap"
import Header from "@/components/ui/Header"
import Analysis from "./components/analysis"
import OnboardingOverlay from "@/components/ui/OnboardingOverlay"
import OnboardingHelpButton from "@/components/ui/OnboardingHelpButton"
import { OnboardingProvider, useOnboarding } from "@/context/OnboardingContext"
import { Button } from "@/components/ui/button"
import { Download, TrendingUp, Sparkles } from "lucide-react"

function MarketAnalysisContent() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const { setCurrentPage } = useOnboarding()

  // Set current page for onboarding
  useEffect(() => {
    setCurrentPage("market")
  }, [setCurrentPage])

  useEffect(() => {
    const updateSidebarState = () => {
      const isCollapsed = document.documentElement.getAttribute("data-sidebar-collapsed") === "true"
      setIsCollapsed(isCollapsed)
    }

    updateSidebarState()

    const observer = new MutationObserver(updateSidebarState)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-sidebar-collapsed"],
    })

    return () => observer.disconnect()
  }, [])

  // Enhanced loading animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen dark:bg-[#15191C] bg-[#fafafa] transition-all duration-500">
      <Header />
      <Sidebar />

      <main className={`p-4 md:p-6 pt-20 transition-all duration-500 ${isCollapsed ? "sm:ml-16" : "sm:ml-64"}`}>
        {/* Enhanced Header Section */}
        <div className="mb-8 flex flex-row justify-between items-center space-x-3.5 md:space-x-0">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div
                className={`w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg transform transition-all duration-700 ease-out ${
                  isLoaded ? "translate-y-0 opacity-100 rotate-0" : "translate-y-4 opacity-0 rotate-12"
                }`}
              >
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h1
                className={`text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent transform transition-all duration-700 ease-out ${
                  isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
              >
                Market Analysis Dashboard
              </h1>
            </div>
            <div
              className={`items-center gap-2 hidden md:flex transform transition-all duration-700 ease-out delay-100 ${
                isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
            >
              <Sparkles className="w-5 h-5 text-purple-500" />
              <p className="text-gray-600 dark:text-gray-300">
                Comprehensive market intelligence and competitive analysis
              </p>
            </div>
          </div>
          <div
            className={`transform transition-all duration-700 ease-out delay-200 ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
            data-onboarding="download-report"
          >
            <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 backdrop-blur-sm border border-purple-500/20">
              <Download className="w-4 h-4" />
              <span className="hidden md:flex">Download Report</span>
            </Button>
          </div>
        </div>

        {/* Enhanced Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
          {/* Top Row */}
          <div
            className={`lg:min-h-[40vh] lg:col-span-2 transform transition-all duration-700 ease-out delay-300 ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            data-onboarding="pricing-comparison"
          >
            <PricingComparison />
          </div>

          <div
            className="min-h-[400px] lg:min-h-[40vh] grid grid-cols-2 gap-4 lg:col-span-2"
            data-onboarding="swot-analysis"
          >
            <div
              className={`transform transition-all duration-700 ease-out delay-400 ${
                isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              <Strengths />
            </div>
            <div
              className={`transform transition-all duration-700 ease-out delay-500 ${
                isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              <Weaknesses />
            </div>
            <div
              className={`transform transition-all duration-700 ease-out delay-600 ${
                isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              <Opportunities />
            </div>
            <div
              className={`transform transition-all duration-700 ease-out delay-700 ${
                isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              <Threats />
            </div>
          </div>

          <div
            className={`lg:min-h-[40vh] lg:col-span-2 transform transition-all duration-700 ease-out delay-800 ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            data-onboarding="competitive-positioning"
          >
            <CompetitivePositioning />
          </div>

          {/* Bottom Row */}
          <div
            className={`lg:min-h-[40vh] lg:col-span-3 transform transition-all duration-700 ease-out delay-900 hidden lg:block ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            data-onboarding="market-map"
          >
            <MarketMap />
          </div>

          <div
            className={`lg:min-h-[40vh] lg:col-span-3 w-full transform transition-all duration-700 ease-out delay-1000 ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            data-onboarding="ai-analysis"
          >
            <Analysis />
          </div>
        </div>
      </main>
    </div>
  )
}

export default function Page() {
  return (
    <OnboardingProvider>
      <MarketAnalysisContent />
      <OnboardingOverlay />
      <OnboardingHelpButton />
    </OnboardingProvider>
  )
}
