"use client"
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import Sidebar from "@/components/ui/Sidebar"
import Header from "@/components/ui/Header"
import { Button } from "@/components/ui/button"
import { Download, TrendingUp, CheckCircle, XCircle, Sparkles } from "lucide-react"
import { Toaster, toast } from "react-hot-toast"
import { useNotifications } from "@/context/NotificationContext"

// Import updated components that accept props
import RevenueChart from "./components/revenueChart"
import KeyFactors from "./components/keyFactors"
import Analysis from "./components/analysis"

// Import Redux hook and types
import { useGetRevenueDataQuery, useDownloadRevenueReportMutation } from "@/state/api"
import type { RevenueTrend } from "@/state/type"

// Keep the original Graph component import (uses static data)
const Graph = dynamic(() => import("./components/graph"), { ssr: false })

export default function Page() {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)
    const { addNotification } = useNotifications();


    // Fetch data using the Redux hook
    const { data: trends, isLoading, error } = useGetRevenueDataQuery()
    const [downloadReport, { isLoading: isDownloading }] = useDownloadRevenueReportMutation()

    // Extract the first trend object (assuming the API always returns at least one if successful)
    const trendData: RevenueTrend | undefined | null = trends?.[0]

    // Listen for changes to the sidebar state
    useEffect(() => {
        console.log("trendData", trendData)
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

    // Trigger animations on component mount - same as statistics
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
                                    Revenue report downloaded successfully.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ))
            addNotification({
                title: "Report Status:",
                message: "Revenue report downloaded successfully.",
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
                                    Failed to download revenue report. Please try again.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            ))
        }
    }

    // Handle loading state for the whole section
    if (isLoading) {
        return (
            <div className="min-h-screen transition-colors duration-300  bg-white dark:bg-[#15191c]">
                <Header />
                <Sidebar />
                <main
                    className={`p-4 md:p-6 md:pt-20 pt-8 transition-all duration-300 ${isCollapsed ? "sm:ml-16" : "sm:ml-64"
                        } flex items-center justify-center min-h-[calc(100vh-theme(spacing.20))]`}
                >
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-purple-100 dark:border-gray-700 p-8">
                        <div className="flex items-center gap-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                            <p className="text-gray-600 dark:text-gray-300">Loading revenue data...</p>
                        </div>
                    </div>
                </main>
            </div>
        )
    }

    // Handle error state for the whole section
    if (error) {
        let errorMessage = "Failed to load revenue data"
        if ("status" in error) {
            errorMessage = "error" in error ? error.error : JSON.stringify(error.data)
        } else if ("message" in error) {
            errorMessage = error.message ?? errorMessage
        }
        return (
            <div className="min-h-screen transition-colors duration-300 bg-white dark:bg-[#15191c]">
                <Header />
                <Sidebar />
                <main
                    className={`p-4 md:p-6 pt-8 transition-all duration-300 ${isCollapsed ? "sm:ml-16" : "sm:ml-64"
                        } flex items-center justify-center min-h-[calc(100vh-theme(spacing.20))]`}
                >
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-red-200 dark:border-red-800 p-8 text-center">
                        <div className="text-red-500 mb-4">
                            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                />
                            </svg>
                        </div>
                        <p className="text-red-600 dark:text-red-400 font-medium">Error loading revenue data:</p>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">{errorMessage}</p>
                    </div>
                </main>
            </div>
        )
    }

    // Render the page with data passed as props
    return (
        <div className="min-h-screen transition-colors duration-300 bg-[#fafafa] dark:bg-[#15191c]">
            <Header />
            <Sidebar />

            <main className={`p-4 md:p-6 pt-8 transition-all duration-300 ${isCollapsed ? "sm:ml-16" : "sm:ml-64"}`}>
                {/* Header Section */}
                <div className="mb-8 flex flex-row justify-between items-center space-x-3.5 md:space-x-0">
                    <div className="s">
                        <div className="flex items-center gap-3 mb-2">
                            <div
                                className={`w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg transform transition-all duration-700 ease-out ${isLoaded ? "translate-y-0 opacity-100 rotate-0" : "translate-y-4 opacity-0 rotate-12"
                                    }`}
                            >
                                <TrendingUp className="w-6 h-6 text-white" />
                            </div>
                            <h1
                                className={`text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent transform transition-all duration-700 ease-out ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                                    }`}
                            >
                                Revenue Dashboard
                            </h1>
                        </div>
                        <div
                            className={`items-center gap-2 hidden md:flex transform transition-all duration-700 ease-out delay-100 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                                }`}
                        >
                            <Sparkles className="w-5 h-5 text-purple-500" />
                            <p className="text-gray-600 dark:text-gray-300">
                            Monitor and analyze revenue performance with real-time insights                            </p>
                        </div>
                    </div>
                    <div className={` transform transition-all duration-700 ease-out delay-100 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                        }`}>
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

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Top Row */}
                    <div className={`lg:min-h-[40vh] transform transition-all duration-700 ease-out delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                        }`}>
                        {/* Pass trendData to RevenueChart */}
                        <RevenueChart trendData={trendData} />
                    </div>

                    <div className={`min-h-[400px] lg:min-h-[40vh] lg:col-span-2 transform transition-all duration-700 ease-out delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                        }`}>
                        {/* Pass monthly_forecast_next_year to Graph */}
                        <Graph monthlyForecast={trendData?.monthly_forecast_next_year} />
                    </div>

                    {/* Bottom Row */}
                    <div className={`lg:min-h-[40vh] w-full transform transition-all duration-700 ease-out delay-400 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                        }`}>
                        {/* Pass key_factors to KeyFactors */}
                        <KeyFactors keyFactorsData={trendData?.key_factors} />
                    </div>

                    <div className={`lg:min-h-[40vh] lg:col-span-2 w-full transform transition-all duration-700 ease-out delay-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                        }`}>
                        {/* Pass analysis to Analysis */}
                        <Analysis analysisData={trendData?.analysis} />
                    </div>
                </div>
            </main>
        </div>
    )
}