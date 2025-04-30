"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Home,
  BarChart2,
  CreditCard,
  DollarSign,
  Globe,
  Upload,
  LogOut,
  Search,
} from "lucide-react";
import Image from "next/image";
import Logo from "@/assets/Logo.png";
import eye from "@/assets/eye.png";
import stars from "@/assets/nav-stars-bg.png";
import { FaUserCircle } from "react-icons/fa";

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSidebar = () => {
    if (window.innerWidth < 640) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
      document.documentElement.setAttribute(
        "data-sidebar-collapsed",
        String(!isCollapsed)
      );
    }
  };

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-sidebar-collapsed",
      String(isCollapsed)
    );
  }, []);

  const navItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: BarChart2, label: "Statistics", href: "/statistics" },
    { icon: CreditCard, label: "Fraud agent", href: "/fraud-page" },
    { icon: DollarSign, label: "Revenue agent", href: "/revenue-page" },
    { icon: Globe, label: "Global market agent", href: "/market-page" },
    { icon: Upload, label: "Data upload", href: "/upload" },
  ];

  return (
    <>
      <div
        id="sidebar"
        className={`fixed font-mulish z-[4854586] top-0 left-0 h-screen bg-[#1d2328] border-r border-gray-800 transition-all duration-300 rounded-e-3xl ${
          isCollapsed ? "w-16" : "w-64"
        } ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0`}
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
                  <div className="flex flex-row items-center space-x-0.5">
                    <h3 className="text-sm font-medium text-white">Magdi</h3>
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
                  alt="Toggle"
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
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={`flex items-center ${
                    isCollapsed ? "justify-center" : ""
                  } px-4 py-2.5 text-gray-300 rounded-lg relative overflow-hidden transition-colors
                    ${
                      isActive
                        ? "shadow-[inset_0_1px_4px_rgba(255,255,255,0.2)] outline outline-2 -outline-offset-2 outline-black/20 bg-gradient-to-r from-[#243461] via-[#15191c] via-[46%] to-[#15191C]"
                        : "hover:shadow-[inset_0_1px_4px_rgba(255,255,255,0.2)] hover:outline hover:outline-2 hover:-outline-offset-2 hover:outline-black/20 hover:bg-gradient-to-r hover:from-[#243461] hover:via-[#15191c] hover:via-[46%] hover:to-[#15191C]"
                    }`}
                >
                  <item.icon
                    className={`w-5 h-5 z-10 ${
                      isCollapsed ? "" : "mr-3"
                    } text-gray-400`}
                  />
                  {!isCollapsed && <span className="z-10">{item.label}</span>}
                  {isActive && (
                    <div className="overlay absolute top-0 left-0">
                      <Image
                        src={stars || "/placeholder.svg"}
                        className="w-full opacity-10"
                        alt="Stars"
                      />
                    </div>
                  )}
                </a>
              );
            })}
          </nav>

          {/* Sign Out */}
          <div className={`group px-4 mt-auto mb-5 ${isCollapsed ? "px-5" : ""}`}>
            <button
              className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-gray-300 outline outline-3 outline-black/20 bg[#243461] transition-all
              group-hover:shadow-[inset_0_1px_4px_rgba(255,255,255,0.2)] group-hover:outline group-hover:outline-2 group-hover:-outline-offset-2 group-hover:outline-black/20 group-hover:bg-gradient-to-r group-hover:from-[#243461] group-hover:via-[#15191c] group-hover:via-[46%] group-hover:to-[#15191C]`}
            >
              <div
                className={`p-3 rounded-full ${
                  isCollapsed
                    ? ""
                    : "outline outline-3 outline-[#98B3FF]/30 bg-gradient-to-t from-[#243461] to-[#15191C] group-hover:outline-none group-hover:bg-none transition-all duration-300"
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
