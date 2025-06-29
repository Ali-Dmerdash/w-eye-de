"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { ChevronLeft, ChevronRight, X, Sparkles } from "lucide-react"
import { useOnboarding } from "@/context/OnboardingContext"

interface TooltipPosition {
  top: number
  left: number
  width: number
  position: "top" | "bottom" | "left" | "right" | "center"
  transform: string
}

export default function OnboardingOverlay() {
  const { isOnboardingActive, currentStep, steps, nextStep, prevStep, skipOnboarding } = useOnboarding()

  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition>({
    top: 0,
    left: 0,
    width: 300,
    position: "center",
    transform: "translate(-50%, -50%)",
  })

  const tooltipRef = useRef<HTMLDivElement>(null)
  const [viewport, setViewport] = useState({ width: 0, height: 0, zoom: 1 })
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  // Enhanced viewport tracking with zoom detection
  useEffect(() => {
    const updateViewport = () => {
      const zoom = window.devicePixelRatio || 1
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
        zoom: zoom,
      })
    }

    updateViewport()

    let timeout: NodeJS.Timeout
    const debouncedResize = () => {
      clearTimeout(timeout)
      timeout = setTimeout(updateViewport, 50) // Faster response
    }

    window.addEventListener("resize", debouncedResize)
    window.addEventListener("scroll", debouncedResize)
    window.addEventListener("orientationchange", debouncedResize)

    return () => {
      window.removeEventListener("resize", debouncedResize)
      window.removeEventListener("scroll", debouncedResize)
      window.removeEventListener("orientationchange", debouncedResize)
      clearTimeout(timeout)
    }
  }, [])

  // Smooth visibility animation with faster timing
  useEffect(() => {
    if (isOnboardingActive) {
      setIsVisible(true)
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 400) // Faster animation
      return () => clearTimeout(timer)
    } else {
      setIsAnimating(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        setIsAnimating(false)
      }, 200) // Faster exit
      return () => clearTimeout(timer)
    }
  }, [isOnboardingActive])

  // Enhanced positioning algorithm with zoom stability
  const calculatePosition = useCallback(
    (target: HTMLElement, preferredPosition: string): TooltipPosition => {
      const rect = target.getBoundingClientRect()
      const { width: vw, height: vh } = viewport

      // Responsive width calculation
      const isMobile = vw < 768
      const isTablet = vw >= 768 && vw < 1024

      let width: number
      if (isMobile) {
        width = Math.min(320, vw - 60)
      } else if (isTablet) {
        width = Math.min(380, vw * 0.4)
      } else {
        width = Math.min(420, vw * 0.35)
      }

      const padding = 20
      const tooltipHeight = isMobile ? 180 : 200
      const spacing = 16

      // Calculate center points
      const targetCenterX = rect.left + rect.width / 2
      const targetCenterY = rect.top + rect.height / 2

      // Position calculations with better centering
      const positions = {
        top: {
          top: rect.top - tooltipHeight - spacing,
          left: targetCenterX,
          transform: "translate(-50%, 0%)",
        },
        bottom: {
          top: rect.bottom + spacing,
          left: targetCenterX,
          transform: "translate(-50%, 0%)",
        },
        left: {
          top: targetCenterY,
          left: rect.left - width - spacing,
          transform: "translate(0%, -50%)",
        },
        right: {
          top: targetCenterY,
          left: rect.right + spacing,
          transform: "translate(0%, -50%)",
        },
        center: {
          top: vh / 2,
          left: vw / 2,
          transform: "translate(-50%, -50%)",
        },
      }

      let { top, left, transform } = positions[preferredPosition as keyof typeof positions] || positions.center
      let finalPosition = preferredPosition as TooltipPosition["position"]

      // Enhanced boundary detection
      const minLeft = padding
      const maxLeft = vw - padding
      const minTop = padding
      const maxTop = vh - tooltipHeight - padding - 100 // Extra space for fixed buttons

      // Handle horizontal boundaries with smart repositioning
      if (finalPosition !== "center") {
        if (preferredPosition === "top" || preferredPosition === "bottom") {
          const halfWidth = width / 2
          if (left - halfWidth < minLeft) {
            left = minLeft + halfWidth
          } else if (left + halfWidth > maxLeft) {
            left = maxLeft - halfWidth
          }
        } else {
          if (preferredPosition === "left" && left < minLeft) {
            finalPosition = "right"
            left = rect.right + spacing
            transform = "translate(0%, -50%)"
          } else if (preferredPosition === "right" && left + width > maxLeft) {
            finalPosition = "left"
            left = rect.left - width - spacing
            transform = "translate(0%, -50%)"
          }
        }

        // Handle vertical boundaries
        if (top < minTop) {
          if (finalPosition === "top") {
            finalPosition = "bottom"
            top = rect.bottom + spacing
          } else {
            top = minTop
            if (finalPosition === "left" || finalPosition === "right") {
              transform = "translate(0%, 0%)"
            }
          }
        } else if (top + tooltipHeight > maxTop) {
          if (finalPosition === "bottom") {
            finalPosition = "top"
            top = rect.top - tooltipHeight - spacing
          } else {
            top = maxTop - tooltipHeight
            if (finalPosition === "left" || finalPosition === "right") {
              transform = "translate(0%, -100%)"
            }
          }
        }
      }

      // Final boundary enforcement
      top = Math.max(minTop, Math.min(top, maxTop - tooltipHeight))
      if (finalPosition !== "center") {
        left = Math.max(
          minLeft,
          Math.min(left, maxLeft - (finalPosition === "left" || finalPosition === "right" ? width : width / 2)),
        )
      }

      return { top, left, width, position: finalPosition, transform }
    },
    [viewport],
  )

  // Target finding and positioning with improved stability
  useEffect(() => {
    if (!isOnboardingActive || !steps[currentStep]) return

    const findAndPosition = () => {
      const target = document.querySelector(steps[currentStep].target) as HTMLElement
      if (target) {
        setTargetElement(target)
        const newPosition = calculatePosition(target, steps[currentStep].position)
        setTooltipPosition(newPosition)
      }
    }

    // Initial positioning
    findAndPosition()

    // Faster retries for better responsiveness
    const retries = [50, 150, 300]
    const timeouts = retries.map((delay) => setTimeout(findAndPosition, delay))

    // Improved resize handler with faster debouncing
    let resizeTimeout: NodeJS.Timeout
    const handleResize = () => {
      if (!targetElement) return
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        const newPosition = calculatePosition(targetElement, steps[currentStep].position)
        setTooltipPosition(newPosition)
      }, 100) // Faster resize response
    }

    window.addEventListener("resize", handleResize)
    window.addEventListener("scroll", handleResize)

    return () => {
      timeouts.forEach(clearTimeout)
      clearTimeout(resizeTimeout)
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("scroll", handleResize)
    }
  }, [isOnboardingActive, currentStep, steps, calculatePosition, targetElement])

  // Keyboard navigation
  useEffect(() => {
    if (!isOnboardingActive) return

    const handleKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault()
          if (currentStep > 0) prevStep()
          break
        case "ArrowRight":
        case " ":
          e.preventDefault()
          nextStep()
          break
        case "Escape":
          e.preventDefault()
          skipOnboarding()
          break
      }
    }

    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [isOnboardingActive, currentStep, nextStep, prevStep, skipOnboarding])

  if (!isVisible || !steps[currentStep]) return null

  const currentStepData = steps[currentStep]
  const progress = ((currentStep + 1) / steps.length) * 100
  const targetRect = targetElement?.getBoundingClientRect()
  const isMobile = viewport.width < 768

  // Fixed button positioning at bottom of screen
  const getFixedButtonPositions = () => {
    const isMobile = viewport.width < 768
    const bottomOffset = isMobile ? 20 : 30
    const sideOffset = isMobile ? 20 : 40

    return {
      leftButton: {
        bottom: bottomOffset,
        left: sideOffset,
      },
      rightButton: {
        bottom: bottomOffset,
        right: sideOffset,
      },
    }
  }

  const buttonPositions = getFixedButtonPositions()

  return (
    <>
      {/* Enhanced Backdrop with smooth animation */}
      <div
        className={`fixed inset-0 bg-gradient-to-br from-black/60 via-purple-900/10 to-black/60 backdrop-blur-[2px] z-[9998] transition-all duration-300 ease-out pointer-events-none ${
          isOnboardingActive ? "opacity-100" : "opacity-0"
        }`}
        style={{
          transform: isOnboardingActive ? "translate3d(0, 0, 0)" : "translate3d(0, 0, 0)",
        }}
      />

      {/* Component Highlight with enhanced glow effect */}
      {targetElement && targetRect && tooltipPosition.position !== "center" && (
        <div
          className="fixed z-[9999] pointer-events-none transition-all duration-300 ease-out"
          style={{
            top: Math.max(0, targetRect.top - 10),
            left: Math.max(0, targetRect.left - 10),
            width: Math.min(targetRect.width + 20, viewport.width - Math.max(0, targetRect.left - 10)),
            height: Math.min(targetRect.height + 20, viewport.height - Math.max(0, targetRect.top - 10)),
            boxShadow: `
              0 0 0 3px rgba(139, 92, 246, 0.9),
              0 0 0 6px rgba(139, 92, 246, 0.6),
              0 0 0 12px rgba(139, 92, 246, 0.3),
              0 0 0 18px rgba(139, 92, 246, 0.1),
              0 0 0 9999px rgba(0, 0, 0, 0.3)
            `,
            borderRadius: isMobile ? "8px" : "12px",
            animation: "pulse-glow 1.5s ease-in-out infinite",
            transform: "translate3d(0, 0, 0)",
          }}
        />
      )}

      {/* Fixed Previous Button - Bottom Left */}
      {currentStep > 0 && (
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            prevStep()
          }}
          className={`fixed z-[10002] w-14 h-14 flex items-center justify-center bg-white/95 dark:bg-gray-800/95 border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-2xl backdrop-blur-sm transition-all duration-200 ease-out hover:scale-110 hover:border-purple-400 hover:shadow-purple-500/25 rounded-full cursor-pointer group ${
            isOnboardingActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{
            bottom: `${buttonPositions.leftButton.bottom}px`,
            left: `${buttonPositions.leftButton.left}px`,
            transitionDelay: isAnimating ? "100ms" : "0ms",
            pointerEvents: "auto",
            transform: `translate3d(0, ${isOnboardingActive ? "0" : "16px"}, 0)`,
          }}
          type="button"
          aria-label="Previous step"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-150" />

          {/* Tooltip for Previous Button */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 ease-out whitespace-nowrap pointer-events-none scale-95 group-hover:scale-100">
            Previous ({currentStep}/{steps.length})
          </div>
        </button>
      )}

      {/* Fixed Next Button - Bottom Right */}
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          nextStep()
        }}
        className={`fixed z-[10002] w-14 h-14 flex items-center justify-center bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-2xl transition-all duration-200 ease-out hover:scale-110 hover:shadow-purple-500/50 rounded-full cursor-pointer group ${
          isOnboardingActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
        style={{
          bottom: `${buttonPositions.rightButton.bottom}px`,
          right: `${buttonPositions.rightButton.right}px`,
          transitionDelay: isAnimating ? "150ms" : "0ms",
          pointerEvents: "auto",
          transform: `translate3d(0, ${isOnboardingActive ? "0" : "16px"}, 0)`,
        }}
        type="button"
        aria-label={currentStep === steps.length - 1 ? "Finish tour" : "Next step"}
      >
        {currentStep === steps.length - 1 ? <X className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}

        {/* Tooltip for Next Button */}
        <div className="absolute bottom-full right-1/2 transform translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 ease-out whitespace-nowrap pointer-events-none scale-95 group-hover:scale-100">
          {currentStep === steps.length - 1 ? "Finish Tour" : `Next (${currentStep + 2}/${steps.length})`}
        </div>
      </button>

      {/* Enhanced Tooltip with smooth animations */}
      <div
        ref={tooltipRef}
        className={`fixed z-[10000] transition-all duration-300 ease-out ${
          isOnboardingActive ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
          transform: `${tooltipPosition.transform} translate3d(0, 0, 0)`,
          width: tooltipPosition.width,
          maxWidth: "95vw",
          transitionDelay: isAnimating ? "50ms" : "0ms",
        }}
      >
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden backdrop-blur-sm relative">
          {/* Gradient border effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-transparent to-purple-500/20 rounded-3xl" />

          {/* Enhanced Arrow */}
          {tooltipPosition.position !== "center" && (
            <div
              className={`absolute w-4 h-4 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rotate-45 transition-all duration-200 ease-out ${
                tooltipPosition.position === "top"
                  ? "bottom-[-8px] left-1/2 -translate-x-1/2 border-b border-r"
                  : tooltipPosition.position === "bottom"
                    ? "top-[-8px] left-1/2 -translate-x-1/2 border-t border-l"
                    : tooltipPosition.position === "left"
                      ? "right-[-8px] top-1/2 -translate-y-1/2 border-t border-r"
                      : "left-[-8px] top-1/2 -translate-y-1/2 border-b border-l"
              }`}
            />
          )}

          {/* Enhanced Content */}
          <div className={isMobile ? "p-5" : "p-6"}>
            {/* Header with enhanced styling */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-500 animate-pulse" />
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-3 py-1.5 rounded-full transition-all duration-200 ease-out">
                    {currentStep + 1} of {steps.length}
                  </span>
                </div>
                {/* Enhanced progress bar */}
                <div className="w-20 h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 transition-all duration-500 ease-out rounded-full relative"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute inset-0 bg-white/30 rounded-full animate-pulse" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full animate-shimmer" />
                  </div>
                </div>
              </div>
              <button
                onClick={skipOnboarding}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-150 ease-out p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl hover:scale-110 hover:rotate-90"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Enhanced title and description */}
            <div className="mb-4">
              <h3
                className={`font-bold text-gray-900 dark:text-white mb-3 leading-tight transition-all duration-300 ease-out ${
                  isMobile ? "text-lg" : "text-xl"
                } ${isAnimating ? "translate-y-2 opacity-0" : "translate-y-0 opacity-100"}`}
                style={{ transitionDelay: isAnimating ? "0ms" : "100ms" }}
              >
                {currentStepData.title}
              </h3>

              <p
                className={`text-gray-600 dark:text-gray-300 leading-relaxed transition-all duration-300 ease-out ${
                  isMobile ? "text-sm" : "text-base"
                } ${isAnimating ? "translate-y-2 opacity-0" : "translate-y-0 opacity-100"}`}
                style={{ transitionDelay: isAnimating ? "0ms" : "150ms" }}
              >
                {currentStepData.description}
              </p>
            </div>

            {/* Enhanced step indicators */}
            <div className="flex justify-center gap-2 pt-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`transition-all duration-400 ease-out rounded-full ${
                    index === currentStep
                      ? "w-8 h-2.5 bg-gradient-to-r from-purple-600 to-purple-500 shadow-lg"
                      : index < currentStep
                        ? "w-2.5 h-2.5 bg-purple-400 dark:bg-purple-600"
                        : "w-2.5 h-2.5 bg-gray-300 dark:bg-gray-600"
                  }`}
                  style={{
                    transitionDelay: `${index * 30}ms`,
                    transform: index === currentStep ? "scale(1.1)" : "scale(1)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced CSS for animations */}
      <style jsx>{`
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 
              0 0 0 3px rgba(139, 92, 246, 0.9),
              0 0 0 6px rgba(139, 92, 246, 0.6),
              0 0 0 12px rgba(139, 92, 246, 0.3),
              0 0 0 18px rgba(139, 92, 246, 0.1),
              0 0 0 9999px rgba(0, 0, 0, 0.3);
          }
          50% {
            box-shadow: 
              0 0 0 3px rgba(139, 92, 246, 1),
              0 0 0 6px rgba(139, 92, 246, 0.8),
              0 0 0 12px rgba(139, 92, 246, 0.5),
              0 0 0 18px rgba(139, 92, 246, 0.2),
              0 0 0 9999px rgba(0, 0, 0, 0.3);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
      `}</style>
    </>
  )
}
