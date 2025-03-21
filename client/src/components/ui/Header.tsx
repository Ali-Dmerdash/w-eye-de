"use client"
import React, { useRef, useState, useEffect } from "react"
import { Bell, Menu } from "lucide-react"

export default function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)
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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
    const sidebar = document.getElementById("sidebar")
    if (sidebar) {
      sidebar.classList.toggle("-translate-x-full")
    }
  }

  const handleClick = () => {
    setIsEditing(true)
    setTimeout(() => inputRef.current?.focus(), 100) // Auto-focus
  }

  const handleBlur = () => {
    if (!inputRef.current?.value) {
      setIsEditing(false) // Hide input if empty
    }
  }

  return (
    <div
      className={`top-0 right-0 z-40 flex items-center justify-between w-full h-16 px-4 bg-[#15191c] transition-all duration-300 
        ${isCollapsed ? "sm:ml-16 sm:w-[calc(100%-4rem)]" : "sm:ml-64 sm:w-[calc(100%-16rem)]"}`}
    >
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="p-2 mr-2 text-gray-400 rounded-lg sm:hidden hover:bg-gray-700">
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center px-4 py-2 bg-[#1B2131] rounded-lg w-60" onClick={handleClick}>
          <svg
            className="w-5 h-5 mr-2 text-blue-400"
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
            <span className="text-sm font-medium text-gray-200 cursor-text">AI Assistant</span>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <Bell className="w-5 h-5 text-gray-400" />
          <span className="ml-1 text-sm font-medium text-white">2 NEW</span>
        </div>
        <div className="hidden md:flex items-center px-3 py-1 bg-[#1B2131] rounded-lg">
          <span className="text-sm font-medium text-gray-200">TODAY, APRIL 8</span>
        </div>
      </div>
    </div>
  )
}

