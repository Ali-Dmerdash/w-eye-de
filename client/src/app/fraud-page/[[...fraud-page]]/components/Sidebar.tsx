"use client"
import { useState } from "react"
import { Home, BarChart2, CreditCard, DollarSign, Globe, Upload, LogOut, Search, Menu } from "lucide-react"
import Image from "next/image"
import Logo from "@/assets/Logo.png"
import eye from "@/assets/eye.png"
import { FaUserCircle } from "react-icons/fa"

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const toggleSidebar = () => {
    if (window.innerWidth < 640) {
      setIsMobileOpen(!isMobileOpen)
    } else {
      setIsCollapsed(!isCollapsed)
    }
  }

  return (
    <>
      {/* Toggle Button - Always visible */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 bg-[#1d2328] rounded-lg text-gray-400 hover:text-white transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Sidebar */}
      <div
        id="sidebar"
        className={`fixed top-0 left-0 z-40 h-screen bg-[#1d2328] border-r border-gray-800 transition-all duration-300 ${
          isCollapsed ? "w-16" : "w-64"
        } ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className={`flex items-center ${isCollapsed ? "justify-center px-2 py-4" : "px-6 py-4"}`}>
            {isCollapsed ? (
              <span className="text-xl font-bold text-white">E</span>
            ) : (
              <Image src={Logo || "/placeholder.svg"} alt="Logo" className="w-[100%]" />
            )}
          </div>

          {/* User Profile */}
          <div
            className={`flex items-center ${isCollapsed ? "justify-center px-2" : "px-6"} py-4 space-x-3 border-b border-gray-800`}
          >
            <div className="relative">
              <FaUserCircle className="text-gray-400 w-10 h-10" />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#1d2328] rounded-full" />
            </div>
            {!isCollapsed && (
              <div className="flex items-center justify-between flex-1">
                <div>
                  <h3 className="text-sm font-medium text-white">Amoura</h3>
                  <p className="text-xs text-gray-400">Test hahahah</p>
                </div>
                <Image src={eye || "/placeholder.svg"} alt="Logo" />
              </div>
            )}
          </div>

          {/* Search */}
          <div className={`${isCollapsed ? "px-2" : "px-4"} py-4`}>
            {isCollapsed ? (
              <button className="w-full flex justify-center p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#15191c] transition-colors">
                <Search className="w-5 h-5" />
              </button>
            ) : (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search anything..."
                  className="w-full px-4 py-2 bg-[#15191c] text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute w-4 h-4 text-gray-400 right-3 top-3" />
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className={`flex-1 ${isCollapsed ? "px-2" : "px-4"} space-y-2 overflow-y-auto`}>
            {[
              { icon: Home, label: "Home" },
              { icon: BarChart2, label: "Statistics" },
              { icon: CreditCard, label: "Fraud agent" },
              { icon: DollarSign, label: "Revenue agent" },
              { icon: Globe, label: "Global market agent" },
              { icon: Upload, label: "Data upload" },
            ].map((item) => (
              <a
                key={item.label}
                href="#"
                className={`flex items-center ${
                  isCollapsed ? "justify-center" : ""
                } px-4 py-2 text-gray-300 rounded-lg hover:bg-[#15191c] group transition-colors`}
              >
                <item.icon className={`w-5 h-5 ${isCollapsed ? "" : "mr-3"} text-gray-400 group-hover:text-gray-300`} />
                {!isCollapsed && <span>{item.label}</span>}
              </a>
            ))}
          </nav>

          {/* Sign Out */}
          <div className={`p-4 mt-auto ${isCollapsed ? "px-2" : ""}`}>
            <button
              className={`flex items-center ${
                isCollapsed ? "justify-center" : ""
              } w-full px-4 py-2 space-x-2 text-gray-300 rounded-lg hover:bg-[#15191c] transition-colors`}
            >
              <LogOut className="w-5 h-5" />
              {!isCollapsed && <span>Sign out</span>}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

