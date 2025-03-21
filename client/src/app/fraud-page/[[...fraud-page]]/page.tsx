"use client"
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import Sidebar from "../../../components/ui/Sidebar"
import FraudInc from "./components/FraudInc"
import TableTransaction from "./components/tableTransaction"
import Header from "../../../components/ui/Header"

const Graph = dynamic(() => import("@/app/fraud-page/[[...fraud-page]]/components/graph"), { ssr: false })
const ReportAmeen = dynamic(() => import("@/app/fraud-page/[[...fraud-page]]/components/reportAmeen"), { ssr: false })

export default function Page() {
  const [isCollapsed, setIsCollapsed] = useState(false)

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

  return (
    <div className="min-h-screen bg-[#15191c]">
      <Header />
      <Sidebar />

      <main
        className={`p-4 md:p-6 pt-20 transition-all duration-300 
        ${isCollapsed ? "sm:ml-16" : "sm:ml-64"}`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Top Row */}
          <div className="min-h-[400px] lg:min-h-[40vh] lg:col-span-2">
            <Graph />
          </div>

          <div className="min-h-[400px] lg:min-h-[40vh]">
            <FraudInc />
          </div>

          {/* Bottom Row */}
          <div className="min-h-[400px] lg:min-h-[40vh] lg:col-span-2">
            <TableTransaction />
          </div>

          <div className="min-h-[400px] lg:min-h-[40vh]">
            <ReportAmeen />
          </div>
        </div>
      </main>
    </div>
  )
}

