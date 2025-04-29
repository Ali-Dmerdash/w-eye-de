"use client"
import React, { useRef, useState, useEffect, useMemo } from "react"
import { ArrowLeft, ArrowRight, Bell, Dot } from "lucide-react"
import Image from "next/image"
import eye from "@/assets/eye.png"


export default function Header() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

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


  const handleClick = () => {
    setIsEditing(true)
    setTimeout(() => inputRef.current?.focus(), 100) // Auto-focus
  }

  const handleBlur = () => {
    if (!inputRef.current?.value) {
      setIsEditing(false) // Hide input if empty
    }
  }

  const todayDate = useMemo(() => {
    const today = new Date()
    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    }
    return `${today.toLocaleDateString("en-US", options)}`
  }, [])

  const yesterdayDate = useMemo(() => {
    const today = new Date()
    today.setDate(today.getDate() - 1);
    const options: Intl.DateTimeFormatOptions = {
      month: 'numeric',
      day: 'numeric'
    }
    return `${today.toLocaleDateString("en-US", options)}`
  }, [])

  const tmwDate = useMemo(() => {
    const today = new Date()
    today.setDate(today.getDate() + 1);
    const options: Intl.DateTimeFormatOptions = {
      month: 'numeric',
      day: 'numeric'
    }
    return `${today.toLocaleDateString("en-US", options)}`
  }, [])


  return (
    <div
      className={`font-mulish top-0 right-0 z-40 flex items-center justify-between w-full px-6 py-3 bg-[#15191c] transition-all duration-300 
        ${isCollapsed ? "sm:ml-16 sm:w-[calc(100%-4rem)]" : "sm:ml-64 sm:w-[calc(100%-16rem)]"}`}
    >
      <div className="sm:hidden flex">
        <Image src={eye || "/placeholder.svg"} className="cursor-pointer rotate-90" alt="Logo" />
      </div>

      <div className="flex items-center">

        <div className="flex items-center px-4 py-2 bg-[#1B2131] rounded-xl lg:w-96 w-52" onClick={handleClick}>
          <svg
            className="w-5 h-5 mr-2 text-gray-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>

          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              className="text-sm font-medium text-gray-200 bg-transparent border-none outline-none w-full"
              placeholder="Type something..."
              onBlur={handleBlur}
            />
          ) : (
            <span className="text-sm font-medium text-gray-200 opacity-80 cursor-text">AI Assistant</span>
          )}
        </div>

      </div>


      <div className="flex items-center md:space-x-4 space-x-2">

        <div className="relative flex items-center border border-gray-200 border-opacity-30 h-10 px-4 md:space-x-2 space-x-1 rounded-xl">
          <Bell className="w-5 h-5 text-gray-200 " />
          <div className="absolute bottom-3 left-3 ">
            <Dot className="w-8 h-8 bg-opacity-25 text-[#ef672d]" />
          </div>

          <div className="bg-[#3d464e70] border border-gray-200 border-opacity-30 rounded-lg px-2">
            <span className="mx-1 md:text-sm text-xs font-medium text-white text-nowrap">2 NEW</span>
          </div>

        </div>


        <div className="hidden sm:flex items-center px-4 h-10 border border-gray-200 border-opacity-30 md:space-x-6 space-x-2 rounded-xl text-nowrap">
          <span className="flex flex-row items-center justify-center space-y-">

            <ArrowLeft className="md:w-5 w-3 md:h-5 h-3 text-gray-200" />
            <span className="text-gray-400 text-[0.5rem] hidden md:block">
              {yesterdayDate}
            </span>
          </span>
          <span className="md:text-sm text-xs font-medium text-gray-200">{todayDate}</span>
          <span className="flex flex-row-reverse items-center justify-center space-y-">

            <ArrowRight className="md:w-5 w-3 md:h-5 h-3 text-gray-200" />
            <span className="text-gray-400 text-[0.5rem] hidden md:block">
              {tmwDate}

            </span>
          </span>
        </div>



      </div>

    </div>
  )
}

