"use client"
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import Sidebar from "../../../components/ui/Sidebar"
import FraudInc from "./components/FraudInc"
import TableTransaction from "./components/tableTransaction"
import Header from "../../../components/ui/Header"
import { Button } from "@/components/ui/button"
import { Download, CheckCircle, XCircle, TrendingUp, Sparkles } from "lucide-react"
import OnboardingOverlay from "@/components/ui/OnboardingOverlay"
import OnboardingHelpButton from "@/components/ui/OnboardingHelpButton"
import { useOnboarding } from "@/context/OnboardingContext"
import { useDownloadFraudReportMutation } from "@/state/api"
import { Toaster, toast } from "react-hot-toast"
import { useNotifications } from "@/context/NotificationContext"

const Graph = dynamic(() => import("@/app/fraud-page/[[...fraud-page]]/components/graph"), { ssr: false })
const ReportAmeen = dynamic(() => import("@/app/fraud-page/[[...fraud-page]]/components/reportAmeen"), { ssr: false })

export default function Page() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const { setCurrentPage } = useOnboarding()
  const [downloadReport, { isLoading: isDownloading }] = useDownloadFraudReportMutation()
  const { addNotification } = useNotifications()

  // Set current page for onboarding
  useEffect(() => {
    setCurrentPage("fraud")
  }, [setCurrentPage])

  // Listen for changes to the sidebar state
  useEffect(() => {
    const updateSidebarState = () => {
      const isCollapsed = document.documentElement.getAttribute("data-sidebar-collapsed") === "true"
      setIsCollapsed(isCollapsed)
    }

    // Initial check
    updateSidebarState()

    // Set up a mutation observer to watch for attribute changes
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

  // Handle download report
  const handleDownloadReport = async () => {
    try {
      await downloadReport().unwrap()
      toast.custom((t) => (
        <div
          className={`$${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white/80 dark:bg-[#23272e]/90 shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-purple-500/20 backdrop-blur-md border border-purple-200/40 dark:border-purple-900/40 transition-all duration-300`}
          style={{ boxShadow: '0 8px 32px 0 rgba(80, 0, 120, 0.15)' }}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <CheckCircle className="h-8 w-8 text-green-500 dark:text-green-400" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  Report Status:
                </p>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  Fraud detection report downloaded successfully.
                </p>
              </div>
            </div>
          </div>
        </div>
      ))
      addNotification({
        title: "Report Status:",
        message: "Fraud detection report downloaded successfully.",
        type: "success"
      })
    } catch (error) {
      console.error("Failed to download report:", error)
      toast.custom((t) => (
        <div
          className={`$${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white/80 dark:bg-[#23272e]/90 shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-purple-500/20 backdrop-blur-md border border-purple-200/40 dark:border-purple-900/40 transition-all duration-300`}
          style={{ boxShadow: '0 8px 32px 0 rgba(80, 0, 120, 0.15)' }}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <XCircle className="h-8 w-8 text-red-500 dark:text-red-400" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  Report Status:
                </p>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  Failed to download fraud detection report. Please try again.
                </p>
              </div>
            </div>
          </div>
         
        </div>
      ))
    }
  }

  return (
    <div className="min-h-screen transition-colors duration-300 dark:bg-[#15191c] bg-[#fafafa]">
      <Header />
      <Sidebar />

      <main className={`p-4 md:p-6 pt-8 transition-all duration-300 ${isCollapsed ? "sm:ml-16" : "sm:ml-64"}`}>
        {/* Header Section */}
        <div
          className="mb-8 flex flex-row justify-between items-center space-x-3.5 md:space-x-0"
          data-onboarding="fraud-header"
        >

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
              Fraud Detection Dashboard
              </h1>
            </div>
            <div
              className={`items-center gap-2 hidden md:flex transform transition-all duration-700 ease-out delay-100 ${
                isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
            >
              <Sparkles className="w-5 h-5 text-purple-500" />
              <p className="text-gray-600 dark:text-gray-300">
              Monitor and analyze fraudulent activities with real-time data
              </p>
            </div>
          </div>

          <div
            className={`transform transition-all duration-700 ease-out delay-100 ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            <Button 
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
              onClick={handleDownloadReport}
              disabled={isDownloading}
            >
              <Download className="w-4 h-4" />
              <span className="hidden md:flex">
                {isDownloading ? "Downloading..." : "Download Report"}
              </span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Row */}
          <div
            className={`lg:col-span-2 transform transition-all duration-700 ease-out delay-200 ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            data-onboarding="transaction-analysis"
          >
            <Graph />
          </div>

          <div
            className={`transform transition-all duration-700 ease-out delay-300 ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            data-onboarding="fraud-metrics"
          >
            <FraudInc />
          </div>

          {/* Bottom Row */}
          <div
            className={`lg:col-span-2 transform transition-all duration-700 ease-out delay-400 ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            data-onboarding="transaction-table"
          >
            <TableTransaction />
          </div>

          <div
            className={`transform transition-all duration-700 ease-out delay-500 ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            data-onboarding="ai-analysis"
          >
            <ReportAmeen />
          </div>
        </div>
      </main>

      {/* Onboarding Overlay */}
      <OnboardingOverlay />

      {/* Floating Onboarding Help Button */}
      <OnboardingHelpButton />
    </div>
  )
}
