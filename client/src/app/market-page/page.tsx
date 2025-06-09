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
import { Button } from "@/components/ui/button"
import { Download, TrendingUp } from "lucide-react"

export default function Page() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

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

  // Trigger animations on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen dark:bg-[#15191C] bg-[#fafafa] transition-all duration-300">
      <Header />
      <Sidebar />

      <main className={`p-4 md:p-6 pt-20 transition-all duration-300 ${isCollapsed ? "sm:ml-16" : "sm:ml-64"}`}>
        {/* Header Section */}
        <div className="mb-8 flex flex-row justify-between items-center space-x-3.5 md:space-x-0">
          <div>
            <h1 className={`text-3xl font-bold text-gray-900 dark:text-white mb-2 transform transition-all duration-700 ease-out ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>Market Analysis Dashboard</h1>
            <div className={`items-center gap-2 hidden md:flex transform transition-all duration-700 ease-out delay-100 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
              <TrendingUp className="w-5 h-5 text-green-500" />
              <p className="text-gray-600 dark:text-gray-300">
                Comprehensive market intelligence and competitive analysis
              </p>
            </div>
          </div>
          <div className={`transform transition-all duration-700 ease-out delay-100 ${
                isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2">
              <Download className="w-4 h-4" />
              <span className="hidden md:flex">Download Report</span>
            </Button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
          {/* Top Row */}
          <div className={`lg:min-h-[40vh] lg:col-span-2 transform transition-all duration-700 ease-out delay-200 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <PricingComparison />
          </div>

          <div className="min-h-[400px] lg:min-h-[40vh] grid grid-cols-2 gap-4 lg:col-span-2">
            <div className={`transform transition-all duration-700 ease-out delay-300 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <Strengths />
            </div>
            <div className={`transform transition-all duration-700 ease-out delay-500 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <Weaknesses />
            </div>
            <div className={`transform transition-all duration-700 ease-out delay-1000 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <Opportunities />
            </div>
            <div className={`transform transition-all duration-700 ease-out delay-1000 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`} style={{transform: isLoaded ? 'translateY(0)' : 'translateY(2rem)', opacity: isLoaded ? 1 : 0, transition: 'all 0.7s ease-out 1.2s'}}>
              <Threats />
            </div>
          </div>

          <div className={`lg:min-h-[40vh] lg:col-span-2 transform transition-all duration-700 ease-out delay-700 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <CompetitivePositioning />
          </div>

          {/* Bottom Row */}
          <div className={`lg:min-h-[40vh] lg:col-span-3 transform transition-all duration-700 ease-out delay-800 hidden lg:block ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`} style={{transform: isLoaded ? 'translateY(0)' : 'translateY(2rem)', opacity: isLoaded ? 1 : 0, transition: 'all 0.7s ease-out 0.8s'}}>
            <MarketMap />
          </div>

          <div className={`lg:min-h-[40vh] lg:col-span-3 w-full transform transition-all duration-700 ease-out delay-900 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`} style={{transform: isLoaded ? 'translateY(0)' : 'translateY(2rem)', opacity: isLoaded ? 1 : 0, transition: 'all 0.7s ease-out 0.9s'}}>
            <Analysis />
          </div>
        </div>
      </main>
    </div>
  )
}
