"use client"

import { useEffect, useState, useCallback } from "react"
import { ChevronLeft, ChevronRight, SkipForward, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useOnboarding } from "@/context/OnboardingContext"

interface TooltipPosition {
  top: number
  left: number
  width: number
  position: "top" | "bottom" | "left" | "right" | "center"
}

export default function OnboardingOverlay() {
  const { isOnboardingActive, currentStep, steps, nextStep, prevStep, skipOnboarding, resetOnboardingForTesting } =
    useOnboarding()

  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition>({
    top: 0,
    left: 0,
    width: 320,
    position: "center",
  })

  const calculateTooltipPosition = useCallback((target: HTMLElement, step: any): TooltipPosition => {
    const rect = target.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    // Use viewport units for consistent sizing across zoom levels
    const minWidth = Math.min(320, viewportWidth * 0.9)
    const maxWidth = Math.min(400, viewportWidth * 0.95)
    const tooltipWidth = viewportWidth < 640 ? minWidth : maxWidth
    const tooltipHeight = 250 // Approximate height
    const padding = viewportWidth < 640 ? 16 : 24

    let top = 0
    let left = 0
    let finalPosition = step.position

    // For center position, always center on screen
    if (step.position === "center") {
      top = viewportHeight / 2
      left = viewportWidth / 2
      return { top, left, width: tooltipWidth, position: "center" }
    }

    // Calculate initial position based on preferred position
    switch (step.position) {
      case "top":
        top = rect.top - tooltipHeight - padding
        left = rect.left + rect.width / 2
        break
      case "bottom":
        top = rect.bottom + padding
        left = rect.left + rect.width / 2
        break
      case "left":
        top = rect.top + rect.height / 2
        left = rect.left - tooltipWidth - padding
        break
      case "right":
        top = rect.top + rect.height / 2
        left = rect.right + padding
        break
    }

    // Smart repositioning to keep tooltip in viewport
    // Check if tooltip would go off screen and adjust
    if (left - tooltipWidth / 2 < padding) {
      left = padding + tooltipWidth / 2
    } else if (left + tooltipWidth / 2 > viewportWidth - padding) {
      left = viewportWidth - padding - tooltipWidth / 2
    }

    if (top < padding) {
      top = rect.bottom + padding
      finalPosition = "bottom"
    } else if (top + tooltipHeight > viewportHeight - padding) {
      top = rect.top - tooltipHeight - padding
      finalPosition = "top"
    }

    // Final boundary check - if still doesn't fit, center it
    if (top < padding || top + tooltipHeight > viewportHeight - padding) {
      top = viewportHeight / 2
      left = viewportWidth / 2
      finalPosition = "center"
    }

    return { top, left, width: tooltipWidth, position: finalPosition }
  }, [])

  useEffect(() => {
    if (!isOnboardingActive || !steps[currentStep]) return

    const findTarget = () => {
      const target = document.querySelector(steps[currentStep].target) as HTMLElement
      if (target) {
        setTargetElement(target)

        // Calculate tooltip position with viewport awareness
        const position = calculateTooltipPosition(target, steps[currentStep])
        setTooltipPosition(position)

        // Scroll target into view with better positioning
        const rect = target.getBoundingClientRect()
        const viewportHeight = window.innerHeight
        const isInView = rect.top >= 100 && rect.bottom <= viewportHeight - 100

        if (!isInView) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "center",
          })

          // Recalculate position after scroll
          setTimeout(() => {
            const newPosition = calculateTooltipPosition(target, steps[currentStep])
            setTooltipPosition(newPosition)
          }, 500)
        }
      }
    }

    // Try to find target immediately
    findTarget()

    // If not found, try again after a short delay
    const timer = setTimeout(findTarget, 100)

    // Recalculate on window resize or zoom
    const handleResize = () => {
      if (targetElement) {
        const position = calculateTooltipPosition(targetElement, steps[currentStep])
        setTooltipPosition(position)
      }
    }

    window.addEventListener("resize", handleResize)
    window.addEventListener("orientationchange", handleResize)

    return () => {
      clearTimeout(timer)
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("orientationchange", handleResize)
    }
  }, [isOnboardingActive, currentStep, steps, calculateTooltipPosition, targetElement])

  if (!isOnboardingActive || !steps[currentStep]) {
    return null
  }

  const currentStepData = steps[currentStep]
  const progress = ((currentStep + 1) / steps.length) * 100

  // Get target element bounds for highlight
  const targetRect = targetElement?.getBoundingClientRect()

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 z-[9998] transition-opacity duration-300" />

      {/* Highlight - only show if we have a target element and it's not center positioned */}
      {targetElement && targetRect && tooltipPosition.position !== "center" && (
        <div
          className="fixed z-[9999] pointer-events-none transition-all duration-500 ease-out"
          style={{
            top: targetRect.top - 8,
            left: targetRect.left - 8,
            width: targetRect.width + 16,
            height: targetRect.height + 16,
            boxShadow: `
              0 0 0 3px rgba(139, 92, 246, 0.8),
              0 0 0 6px rgba(139, 92, 246, 0.4),
              0 0 0 9px rgba(139, 92, 246, 0.2),
              0 0 0 9999px rgba(0, 0, 0, 0.3)
            `,
            borderRadius: "12px",
          }}
        />
      )}

      {/* Tooltip with responsive design */}
      <div
        className="fixed z-[10000] transition-all duration-300 ease-out"
        style={{
          top:
            tooltipPosition.position === "center"
              ? "50%"
              : tooltipPosition.position === "top"
                ? tooltipPosition.top
                : tooltipPosition.position === "bottom"
                  ? tooltipPosition.top
                  : tooltipPosition.top,
          left: tooltipPosition.position === "center" ? "50%" : tooltipPosition.left,
          transform:
            tooltipPosition.position === "center"
              ? "translate(-50%, -50%)"
              : tooltipPosition.position === "top"
                ? "translate(-50%, -100%)"
                : tooltipPosition.position === "bottom"
                  ? "translate(-50%, 0%)"
                  : tooltipPosition.position === "left"
                    ? "translate(-100%, -50%)"
                    : "translate(0%, -50%)",
          width: tooltipPosition.width,
          maxWidth: "95vw",
        }}
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 relative backdrop-blur-sm">
          {/* Arrow - only show for non-center positions */}
          {tooltipPosition.position !== "center" && (
            <div
              className={`absolute w-3 h-3 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rotate-45 ${
                tooltipPosition.position === "top"
                  ? "bottom-[-6px] left-1/2 -translate-x-1/2 border-b border-r"
                  : tooltipPosition.position === "bottom"
                    ? "top-[-6px] left-1/2 -translate-x-1/2 border-t border-l"
                    : tooltipPosition.position === "left"
                      ? "right-[-6px] top-1/2 -translate-y-1/2 border-t border-r"
                      : "left-[-6px] top-1/2 -translate-y-1/2 border-b border-l"
              }`}
            />
          )}

          <div className="p-4 sm:p-6">
            {/* Header with progress and skip */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                <span className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                  Step {currentStep + 1} of {steps.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {/* Reset button for testing */}
                {process.env.NODE_ENV === "development" && (
                  <button
                    onClick={resetOnboardingForTesting}
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded"
                    title="Reset onboarding (for testing)"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                )}
                <button
                  onClick={skipOnboarding}
                  className="flex items-center gap-1 text-xs sm:text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  <SkipForward className="w-3 h-3 sm:w-4 sm:h-4" />
                  Skip
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-4 sm:mb-6">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 sm:h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-500 to-purple-600 h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Content */}
            <div className="mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 leading-tight">
                {currentStepData.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                {currentStepData.description}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-2 sm:gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3"
              >
                <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Previous</span>
                <span className="sm:hidden">Prev</span>
              </Button>

              <div className="flex items-center gap-2 sm:gap-3">
                {/* Step indicators */}
                <div className="flex items-center gap-1">
                  {steps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${
                        index === currentStep
                          ? "bg-purple-500 scale-125"
                          : index < currentStep
                            ? "bg-purple-300 dark:bg-purple-700"
                            : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    />
                  ))}
                </div>

                <Button
                  size="sm"
                  onClick={nextStep}
                  className="flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-xs sm:text-sm px-2 sm:px-3"
                >
                  {currentStep === steps.length - 1 ? "Finish" : "Next"}
                  {currentStep !== steps.length - 1 && <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
