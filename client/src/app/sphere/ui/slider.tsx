"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"
import { useTheme } from "@/context/ThemeContext"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    className?: string
  }
>(({ className, ...props }, ref) => {
  const { theme } = useTheme();
  
  return (
  <SliderPrimitive.Root
    ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
    {...props}
  >
      <SliderPrimitive.Track
        className={cn(
          "relative h-1.5 w-full grow overflow-hidden rounded-full",
          theme === "dark" 
            ? "bg-gray-800" 
            : "bg-gray-200"
        )}
      >
        <SliderPrimitive.Range
          className={cn(
            "absolute h-full",
            theme === "dark" 
              ? "bg-blue-600" 
              : "bg-blue-600"
          )}
        />
    </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        className={cn(
          "block h-4 w-4 rounded-full border-2 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          theme === "dark" 
            ? "border-blue-600 bg-blue-600 hover:bg-blue-500 hover:border-blue-500" 
            : "border-blue-600 bg-blue-600 hover:bg-blue-500 hover:border-blue-500"
        )}
      />
  </SliderPrimitive.Root>
  )
})
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
