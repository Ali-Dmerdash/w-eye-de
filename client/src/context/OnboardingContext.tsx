"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface OnboardingStep {
  id: string
  title: string
  description: string
  target: string
  position: "top" | "bottom" | "left" | "right" | "center"
  action?: string
}

interface OnboardingContextType {
  isOnboardingActive: boolean
  currentStep: number
  steps: OnboardingStep[]
  startOnboarding: () => void
  nextStep: () => void
  prevStep: () => void
  skipOnboarding: () => void
  completeOnboarding: () => void
  resetOnboardingForTesting: () => void
  // New methods for page-specific onboarding
  startFraudOnboarding: () => void
  currentPage: "home" | "fraud"
  setCurrentPage: (page: "home" | "fraud") => void
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

// Home page onboarding steps
const homeOnboardingSteps: OnboardingStep[] = [
  {
    id: "welcome",
    title: "Welcome to Your Dashboard!",
    description:
      "Let's take a quick tour of your dashboard to help you get started. We'll show you the key features and how to navigate around.",
    target: "body",
    position: "center",
  },
  {
    id: "sidebar",
    title: "Navigation Sidebar",
    description:
      "This is your main navigation hub. Access different sections like Statistics, Fraud Detection, Revenue Analysis, and more. Click the eye icon to collapse/expand it.",
    target: "#sidebar",
    position: "right",
  },
  {
    id: "header-search",
    title: "AI Assistant",
    description:
      "Your intelligent AI assistant is always ready to help! Click here or type to ask questions, get insights, or request help with your dashboard.",
    target: '[data-onboarding="ai-assistant"]',
    position: "bottom",
  },
  {
    id: "header-notifications",
    title: "Notifications Center",
    description:
      "Stay updated with important alerts, system updates, and business insights. The orange dot indicates new notifications waiting for you.",
    target: '[data-onboarding="notifications"]',
    position: "bottom",
  },
  {
    id: "header-theme",
    title: "Theme Toggle",
    description:
      "Switch between light and dark modes to customize your viewing experience. Choose what's most comfortable for your eyes!",
    target: '[data-onboarding="theme-toggle"]',
    position: "bottom",
  },
  {
    id: "stats",
    title: "Key Performance Metrics",
    description:
      "These cards display your most important business metrics at a glance. They update in real-time to keep you informed about your performance.",
    target: '[data-onboarding="stats-cards"]',
    position: "bottom",
  },
  {
    id: "welcome-card",
    title: "Personal Welcome",
    description:
      "Your personalized welcome area. This space adapts to show relevant information and quick actions based on your role and recent activity.",
    target: '[data-onboarding="welcome-card"]',
    position: "bottom",
  },
  {
    id: "chart",
    title: "Analytics & Insights",
    description:
      "View detailed analytics and trends with interactive charts. This helps you understand your data patterns and make informed decisions.",
    target: '[data-onboarding="chart-card"]',
    position: "top",
  },
  {
    id: "kpi",
    title: "3D KPI Visualization",
    description:
      "Monitor your Key Performance Indicators with this interactive 3D visualization. It provides a unique perspective on your business health.",
    target: '[data-onboarding="kpi-dashboard"]',
    position: "left",
  },
  {
    id: "settings",
    title: "Dashboard Controls",
    description:
      "Access advanced settings, fullscreen mode, and customization options. Take control of your dashboard experience and make it work for you!",
    target: '[data-onboarding="kpi-controls"]',
    position: "bottom",
  },
]

// Fraud page onboarding steps
const fraudOnboardingSteps: OnboardingStep[] = [
  {
    id: "fraud-welcome",
    title: "Welcome to Fraud Detection!",
    description:
      "This is your comprehensive fraud detection dashboard. Let's explore the powerful tools available to monitor, analyze, and prevent fraudulent activities.",
    target: "body",
    position: "center",
  },
//   {
//     id: "fraud-header",
//     title: "Fraud Dashboard Header",
//     description:
//       "Your fraud detection command center. The download button lets you export detailed fraud reports for compliance and analysis purposes.",
//     target: '[data-onboarding="fraud-header"]',
//     position: "bottom",
//   },
  {
    id: "transaction-analysis",
    title: "Transaction Analysis Chart",
    description:
      "Monitor transaction patterns with real-time charts showing fraudulent vs legitimate transactions. The circular metrics show detection rates, false positives, and overall accuracy.",
    target: '[data-onboarding="transaction-analysis"]',
    position: "bottom",
  },
  {
    id: "fraud-metrics",
    title: "Fraud Detection Metrics",
    description:
      "View your current fraud incidence rate and identify the most common fraudulent patterns. This helps you understand emerging threats and adjust your security measures.",
    target: '[data-onboarding="fraud-metrics"]',
    position: "left",
  },
  {
    id: "transaction-table",
    title: "Transaction Data Table",
    description:
      "Detailed view of all transactions with fraud risk scores. Click on any transaction to see complete details, download data, or send to AI chat for analysis. Customize columns to focus on what matters most.",
    target: '[data-onboarding="transaction-table"]',
    position: "top",
  },
  {
    id: "ai-analysis",
    title: "AI Analysis Report",
    description:
      "Get intelligent insights from our AI system. View fraud causes, recommendations, and generate comprehensive reports to help you make informed decisions about your security strategy.",
    target: '[data-onboarding="ai-analysis"]',
    position: "left",
  },
]

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [isOnboardingActive, setIsOnboardingActive] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false)
  const [currentPage, setCurrentPage] = useState<"home" | "fraud">("home")
  const [hasCompletedFraudOnboarding, setHasCompletedFraudOnboarding] = useState(false)

  // Get current steps based on page
  const steps = currentPage === "home" ? homeOnboardingSteps : fraudOnboardingSteps

  useEffect(() => {
    // Check if user has completed onboarding for current page
    const homeCompleted = localStorage.getItem("dashboard-onboarding-completed")
    const fraudCompleted = localStorage.getItem("fraud-onboarding-completed")

    setHasCompletedOnboarding(!!homeCompleted)
    setHasCompletedFraudOnboarding(!!fraudCompleted)

    // Auto-start onboarding based on current page
    if (currentPage === "home" && !homeCompleted) {
      const timer = setTimeout(() => {
        setIsOnboardingActive(true)
      }, 2000)
      return () => clearTimeout(timer)
    } else if (currentPage === "fraud" && !fraudCompleted) {
      const timer = setTimeout(() => {
        setIsOnboardingActive(true)
      }, 2000)
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

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      completeOnboarding()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const skipOnboarding = () => {
    setIsOnboardingActive(false)
    const storageKey = currentPage === "home" ? "dashboard-onboarding-completed" : "fraud-onboarding-completed"
    localStorage.setItem(storageKey, "true")

    if (currentPage === "home") {
      setHasCompletedOnboarding(true)
    } else {
      setHasCompletedFraudOnboarding(true)
    }
  }

  const completeOnboarding = () => {
    setIsOnboardingActive(false)
    const storageKey = currentPage === "home" ? "dashboard-onboarding-completed" : "fraud-onboarding-completed"
    localStorage.setItem(storageKey, "true")

    if (currentPage === "home") {
      setHasCompletedOnboarding(true)
    } else {
      setHasCompletedFraudOnboarding(true)
    }
  }

  const resetOnboardingForTesting = () => {
    localStorage.removeItem("dashboard-onboarding-completed")
    localStorage.removeItem("fraud-onboarding-completed")
    setHasCompletedOnboarding(false)
    setHasCompletedFraudOnboarding(false)
    setIsOnboardingActive(false)
    setCurrentStep(0)
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
        completeOnboarding,
        resetOnboardingForTesting,
        startFraudOnboarding,
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
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider")
  }
  return context
}
