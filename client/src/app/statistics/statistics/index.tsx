"use client"

import { useEffect, useState } from "react"
import Row1 from "./Row1"
import Row2 from "./Row2"
import Row3 from "./Row3"
import { useOnboarding } from "@/context/OnboardingContext"

const Dashboard = () => {
  const [isLoaded, setIsLoaded] = useState(false)
  const { setCurrentPage } = useOnboarding()

  // Set current page for onboarding
  useEffect(() => {
    setCurrentPage("statistics")
  }, [setCurrentPage])

  // Trigger animations on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="w-full h-full font-mulish">
      <div className="grid gap-6 w-full">
        {/* Summary Section - Performance Overview */}
        <div
          className={`transform transition-all duration-700 ease-out ${
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
          data-onboarding="performance-overview"
        >
          <Row3 section="j" />
        </div>

        {/* Large screens layout */}
        <div className="hidden xl:grid xl:grid-cols-3 xl:gap-6 xl:grid-flow-row">
          {/* Row 1 - Charts a, b, c */}
          <div className="xl:col-span-3 grid xl:grid-cols-3 xl:gap-6" data-onboarding="row1-analytics">
            <div
              className={`h-[350px] transform transition-all duration-700 ease-out delay-100 ${
                isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              <Row1 section="a" />
            </div>
            <div
              className={`h-[350px] transform transition-all duration-700 ease-out delay-200 ${
                isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              <Row1 section="b" />
            </div>
            <div
              className={`h-[350px] transform transition-all duration-700 ease-out delay-300 ${
                isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              <Row1 section="c" />
            </div>
          </div>

          {/* Row 2 - Charts d, e, f */}
          <div className="xl:col-span-3 grid xl:grid-cols-3 xl:gap-6" data-onboarding="row2-analytics">
            <div
              className={`h-[350px] transform transition-all duration-700 ease-out delay-400 ${
                isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              <Row2 section="d" />
            </div>
            <div
              className={`h-[350px] transform transition-all duration-700 ease-out delay-500 ${
                isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              <Row2 section="e" />
            </div>
            <div
              className={`h-[350px] transform transition-all duration-700 ease-out delay-600 ${
                isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              <Row2 section="f" />
            </div>
          </div>

          {/* Row 3 - Charts g, h, i */}
          <div className="xl:col-span-3 grid xl:grid-cols-3 xl:gap-6" data-onboarding="row3-analytics">
            <div
              className={`h-[350px] transform transition-all duration-700 ease-out delay-700 ${
                isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              <Row3 section="g" />
            </div>
            <div
              className={`h-[350px] transform transition-all duration-700 ease-out delay-800 ${
                isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              <Row3 section="h" />
            </div>
            <div
              className={`h-[350px] transform transition-all duration-700 ease-out delay-900 ${
                isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              <Row3 section="i" />
            </div>
          </div>
        </div>

        {/* Medium screens layout */}
        <div className="hidden md:grid md:grid-cols-2 xl:hidden md:gap-6">
          {/* Row 1 */}
          <div className="md:col-span-2 grid md:grid-cols-2 md:gap-6 mb-6" data-onboarding="row1-analytics">
            <div
              className={`h-[350px] transform transition-all duration-700 ease-out delay-100 ${
                isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              <Row1 section="a" />
            </div>
            <div
              className={`h-[350px] transform transition-all duration-700 ease-out delay-200 ${
                isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              <Row1 section="b" />
            </div>
            <div
              className={`md:col-span-2 h-[350px] transform transition-all duration-700 ease-out delay-300 ${
                isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              <Row1 section="c" />
            </div>
          </div>

          {/* Row 2 */}
          <div className="md:col-span-2 grid md:grid-cols-2 md:gap-6 mb-6" data-onboarding="row2-analytics">
            <div
              className={`h-[350px] transform transition-all duration-700 ease-out delay-400 ${
                isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              <Row2 section="d" />
            </div>
            <div
              className={`h-[350px] transform transition-all duration-700 ease-out delay-500 ${
                isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              <Row2 section="e" />
            </div>
            <div
              className={`md:col-span-2 h-[350px] transform transition-all duration-700 ease-out delay-600 ${
                isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              <Row2 section="f" />
            </div>
          </div>

          {/* Row 3 */}
          <div className="md:col-span-2 grid md:grid-cols-2 md:gap-6" data-onboarding="row3-analytics">
            <div
              className={`h-[350px] transform transition-all duration-700 ease-out delay-700 ${
                isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              <Row3 section="g" />
            </div>
            <div
              className={`h-[350px] transform transition-all duration-700 ease-out delay-800 ${
                isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              <Row3 section="h" />
            </div>
            <div
              className={`md:col-span-2 h-[350px] transform transition-all duration-700 ease-out delay-900 ${
                isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              <Row3 section="i" />
            </div>
          </div>
        </div>

        {/* Small screens layout */}
        <div className="md:hidden flex flex-col gap-6">
          <div className="flex flex-col gap-6" data-onboarding="row1-analytics">
            <div
              className={`h-[350px] transform transition-all duration-700 ease-out delay-100 ${
                isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              <Row1 section="a" />
            </div>
            <div
              className={`h-[350px] transform transition-all duration-700 ease-out delay-200 ${
                isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              <Row1 section="b" />
            </div>
            <div
              className={`h-[350px] transform transition-all duration-700 ease-out delay-300 ${
                isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              <Row1 section="c" />
            </div>
          </div>

          <div className="flex flex-col gap-6" data-onboarding="row2-analytics">
            <div
              className={`h-[350px] transform transition-all duration-700 ease-out delay-400 ${
                isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              <Row2 section="d" />
            </div>
            <div
              className={`h-[350px] transform transition-all duration-700 ease-out delay-500 ${
                isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              <Row2 section="e" />
            </div>
            <div
              className={`h-[350px] transform transition-all duration-700 ease-out delay-600 ${
                isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              <Row2 section="f" />
            </div>
          </div>

          <div className="flex flex-col gap-6" data-onboarding="row3-analytics">
            <div
              className={`h-[350px] transform transition-all duration-700 ease-out delay-700 ${
                isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              <Row3 section="g" />
            </div>
            <div
              className={`h-[350px] transform transition-all duration-700 ease-out delay-800 ${
                isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              <Row3 section="h" />
            </div>
            <div
              className={`h-[350px] transform transition-all duration-700 ease-out delay-900 ${
                isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              <Row3 section="i" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
