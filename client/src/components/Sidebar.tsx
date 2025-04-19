"use client";
import { useState, useEffect } from "react";
import {
  Home,
  BarChart2,
  CreditCard,
  DollarSign,
  Globe,
  Upload,
  LogOut,
  Search,
  Menu,
} from "lucide-react";
import Image from "next/image";
import Logo from "@/assets/Logo.png";
import eye from "@/assets/eye.png";
import stars from "@/assets/nav-stars-bg.png";
import { FaUserCircle } from "react-icons/fa";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSidebar = () => {
    if (window.innerWidth < 640) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
      // Update the document with a data attribute to help with responsive styling
      document.documentElement.setAttribute(
        "data-sidebar-collapsed",
        String(!isCollapsed)
      );
    }
  };

  // Set initial data attribute on mount
  useEffect(() => {
    document.documentElement.setAttribute(
      "data-sidebar-collapsed",
      String(isCollapsed)
    );
  }, []);

  return (
    <>
      {/* Sidebar */}
      <div
        id="sidebar"
        className={`fixed font-mulish z-[4854586] top-0 left-0 h-screen bg-[#1d2328] border-r border-gray-800 transition-all duration-300 ${
          isCollapsed ? "w-16" : "w-64"
        } ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div
            className={`flex items-center ${
              isCollapsed ? "justify-center px-2 py-4" : "px-6 py-4"
            }`}
          >
            {isCollapsed ? (
              <Image
                onClick={toggleSidebar}
                className="cursor-pointer rotate-90"
                src={eye || "/placeholder.svg"}
                alt="Logo"
              />
            ) : (
              <Image
                src={Logo || "/placeholder.svg"}
                alt="Logo"
                className="w-[100%]"
              />
            )}
          </div>

          {/* User Profile */}
          <div
            className={`flex items-center ${
              isCollapsed ? "justify-center px-2" : "px-6"
            } py-4 space-x-3 border-b border-gray-800`}
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
                    <p className="text-[0.6rem] bg-red-700 border border-red-400 px-1 rounded-sm font-bayon text-red-900 ">
                      CEO
                    </p>
                  </div>
                  <p className="text-[0.5rem] text-gray-400">
                    Lorem, ipsum dolor.
                  </p>
                </div>
                <Image
                  onClick={toggleSidebar}
                  src={eye || "/placeholder.svg"}
                  className="cursor-pointer"
                  alt="Logo"
                />
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
          <nav
            className={`flex-1 pt-1 ${
              isCollapsed ? "px-2" : "px-4"
            } space-y-2 overflow-y-auto`}
          >
            <a
              href="/"
              className={`flex items-center shadow-[inset_0_1px_4px_rgba(255,255,255,0.2)] outline outline-2 -outline-offset-2 outline-black/20 bg-gradient-to-r from-[#243461] via-[#15191c] via-[46%] to-[#15191C] ${
                isCollapsed ? "justify-center" : ""
              } px-4 py-2.5 text-gray-300 rounded-lg transition-colors relative overflow-hidden`}
            >
              <Home
                className={`w-5 h-5 z-10 ${
                  isCollapsed ? "" : "mr-3"
                } text-gray-400 `}
              />
              {!isCollapsed && <span className="z-10">Home</span>}
              <div className="overlay absolute top-0 left-0">
                <Image
                  src={stars || "/placeholder.svg"}
                  className="w-full opacity-10"
                  alt="Logo"
                />
              </div>
            </a>
            {[
              { icon: BarChart2, label: "Statistics", href: "statistics" },
              { icon: CreditCard, label: "Fraud agent", href: "fraud-page" },
              { icon: DollarSign, label: "Revenue agent", href: "revenue" },
              { icon: Globe, label: "Global market agent", href: "market" },
              { icon: Upload, label: "Data upload" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`flex items-center ${
                  isCollapsed ? "justify-center" : ""
                } px-4 py-2.5 text-gray-300 rounded-lg  relative overflow-hidden
                  transition-colors duration-300
                  hover:shadow-[inset_0_1px_4px_rgba(255,255,255,0.2)] hover:outline hover:outline-2 hover:-outline-offset-2 hover:outline-black/20 hover:bg-gradient-to-r hover:from-[#243461] hover:via-[#15191c] hover:via-[46%] hover:to-[#15191C]


                  `}
              >
                <item.icon
                  className={`w-5 h-5 z-10 ${
                    isCollapsed ? "" : "mr-3"
                  } text-gray-400 group-hover:text-gray-300`}
                />
                {!isCollapsed && <span className="z-10">{item.label}</span>}

                {/* Lama n-merge hsh8l el 7eta deh 3shan elstars sh8ala bdon el hover */}
                {/* <div className="overlay absolute top-0 left-0">
                  <Image src={stars || "/placeholder.svg"} className="w-full opacity-10" alt="Logo" />
                </div> */}
              </a>
            ))}
          </nav>

          {/* Sign Out */}
          <div className={`px-4 mt-auto mb-5 ${isCollapsed ? "px-5" : ""}`}>
            <button
              className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-gray-300 outline outline-3 outline-black/20 bg[#243461] transition-all`}
            >
              <div
                className={`p-3 rounded-full ${
                  isCollapsed
                    ? ""
                    : "outline outline-3 outline-[#98B3FF]/30 bg-gradient-to-t from-[#243461] to-[#15191C]"
                }`}
              >
                <LogOut className="w-4 h-4 rotate-180" />
              </div>
              {!isCollapsed && <span>Sign out</span>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
