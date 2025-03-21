"use client"
import { useState, useEffect } from "react"
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
      // Update the document with a data attribute to help with responsive styling
      document.documentElement.setAttribute("data-sidebar-collapsed", String(!isCollapsed))
    }
  }

  // Set initial data attribute on mount
  useEffect(() => {
    document.documentElement.setAttribute("data-sidebar-collapsed", String(isCollapsed))
  }, [])

  return (
    <>

      {/* Sidebar */}
      <div
        id="sidebar"
        className={`fixed font-mulish top-0 left-0 h-screen bg-[#1d2328] border-r border-gray-800 transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"
          } ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className={`flex items-center ${isCollapsed ? "justify-center px-2 py-4" : "px-6 py-4"}`}>
            {isCollapsed ? (
              <Image onClick={toggleSidebar} className="cursor-pointer rotate-90" src={eye || "/placeholder.svg"} alt="Logo" />
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
                  <div className="flex flex-row justify-center items-center space-x-0.5">
                    <h3 className="text-md font-medium text-white">Amoura</h3>
                    <p className="text-[0.6rem] bg-red-700 border border-red-400 px-1 rounded-sm font-bayon text-red-900 ">CEO</p>
                  </div>
                  <p className="text-xs text-gray-400">Test hahahah</p>
                </div>
                <Image onClick={toggleSidebar} src={eye || "/placeholder.svg"} className="cursor-pointer" alt="Logo" />
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
                className={`flex items-center bg-gradient-to-r from-[#243461] via-[#15191c] via-[46%] to-[#15191C]  ${isCollapsed ? "justify-center" : ""
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
              className={`flex items-center ${isCollapsed ? "justify-center" : ""
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

