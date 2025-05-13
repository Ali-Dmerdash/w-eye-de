"use client"
import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { Home, BarChart2, CreditCard, DollarSign, Globe, Upload, LogOut, Search } from "lucide-react"
import Image from "next/image"
import LogoLight from "@/assets/LogoLight.png"
import LogoDark from "@/assets/Logo.png"
import eye from "@/assets/eye.png"
import eyeLight from "@/assets/eyeLight.png"
import stars from "@/assets/nav-stars-bg.png"
import { useTheme } from "@/context/ThemeContext"
import { useSidebar } from "@/context/SidebarContext"

export default function Sidebar() {
  const pathname = usePathname()
  const { isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen } = useSidebar();
  const { theme } = useTheme()
  
  // Sync with localStorage on mount
  useEffect(() => {
    try {
      const savedState = localStorage.getItem('sidebar-collapsed');
      if (savedState !== null) {
        // Only update if different from current state to avoid unnecessary renders
        if ((savedState === 'true') !== isCollapsed) {
          setIsCollapsed(savedState === 'true');
        }
      }
    } catch (e) {
      console.error("Error syncing with localStorage:", e);
    }
  }, [pathname, isCollapsed, setIsCollapsed]);
  
  const handleSignOut = () => {
    // Simple sign out function - can be expanded later
    console.log("Sign out clicked")
    // Redirect to home page
    window.location.href = "/"
  }

  const toggleSidebar = () => {
    if (window.innerWidth < 640) {
      setIsMobileOpen((prev) => !prev);
    } else {
      setIsCollapsed((prev) => {
        const newValue = !prev;
        document.documentElement.setAttribute("data-sidebar-collapsed", String(newValue));
        localStorage.setItem('sidebar-collapsed', String(newValue));
        return newValue;
      });
    }
  }

  const navItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: BarChart2, label: "Statistics", href: "/statistics" },
    { icon: CreditCard, label: "Fraud agent", href: "/fraud-page" },
    { icon: DollarSign, label: "Revenue agent", href: "/revenue-page" },
    { icon: Globe, label: "Global market agent", href: "/market-page" },
    { icon: Upload, label: "Data upload", href: "/upload" },
  ]

  return (
    <div
      id="sidebar"
      className={`fixed font-mulish z-50 top-0 left-0 h-screen transition-all duration-300 rounded-e-3xl
        ${isCollapsed ? "w-16" : "w-64"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0
        bg-[#E4E5F1] border-r border-gray-300 shadow-[6px_0_16px_0_rgba(44,62,80,0.15)]
        dark:bg-[#1d2328] dark:border-gray-800`}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className={`flex items-center ${isCollapsed ? "justify-center px-2 py-4" : "px-6 py-4"}`}>
          {isCollapsed ? (
            <Image
              onClick={toggleSidebar}
              className="cursor-pointer rotate-90"
              src={theme === "dark" ?  eye : eyeLight|| "/placeholder.svg"}
              alt="Logo"
            />
          ) : (
            <Image src={theme === "dark" ? LogoDark : LogoLight} alt="Logo" className="w-[100%]" />
          )}
        </div>
        {/* User Profile */}
        <div
          className={`flex items-center ${isCollapsed ? "justify-center px-2" : "px-6"} py-4 space-x-3 border-b border-gray-300 dark:border-gray-800`}
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
              <span className="text-gray-600 dark:text-gray-300 font-medium">U</span>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#1d2328] rounded-full" />
            </div>
          </div>
          {!isCollapsed && (
            <div className="flex items-center justify-between flex-1">
              <div>
                <div className="flex flex-row items-center space-x-0.5">
                  <h3 className="text-sm font-medium text-[#9394A5] dark:text-white">
                    User
                  </h3>
                  <p className="text-[0.6rem] bg-red-700 border border-red-400 px-1 rounded-sm font-bayon text-red-900 ">
                    CEO
                  </p>
                </div>
                <p className="text-[0.5rem] text-gray-400 dark:text-gray-400">
                  user@example.com
                </p>
              </div>
              <Image
                onClick={toggleSidebar}
                src={theme === "dark" ?  eye : eyeLight|| "/placeholder.svg"}
                className="cursor-pointer"
                alt="Toggle"
              />
            </div>
          )}
        </div>
        {/* Search */}
        <div className={`${isCollapsed ? "px-2" : "px-4"} hidden py-4`}>
          {isCollapsed ? (
            <button className="w-full flex justify-center p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#15191c] transition-colors">
              <Search className="w-5 h-5" />
            </button>
          ) : (
            <div className="relative">
              <input
                type="text"
                placeholder="Search anything..."
                className="w-full px-4 py-2 bg-[#15191c] dark:bg-[#15191c] text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute w-4 h-4 text-gray-400 right-3 top-3" />
            </div>
          )}
        </div>
        {/* Navigation */}
        <nav className={`flex-1 pt-5 ${isCollapsed ? "px-2" : "px-4"} space-y-4 overflow-y-auto`}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <a
                key={item.label}
                href={item.href}
                className={`group flex items-center ${isCollapsed ? "justify-center" : ""} px-4 py-2.5 rounded-lg relative overflow-hidden transition-all duration-300
                  ${isActive
                    ? "text-[#E4E5F1] shadow-[inset_0_1px_4px_rgba(255,255,255,0.2)] dark:outline-none outline outline-2 -outline-offset-2 outline-[#D2D3DB]/20 bg-gradient-to-r from-[#9394A5] via-[#4B65AB] via-[46%] to-[#4B65AB] dark:from-[#243461] dark:via-[#15191c] dark:via-[46%] dark:to-[#15191C]"
                    : "text-[#686868] hover:text-[#E4E5F1] hover:shadow-[inset_0_1px_4px_rgba(255,255,255,0.2)] dark:outline-none hover:outline hover:outline-2 hover:-outline-offset-2 hover:outline-[#D2D3DB]/20 hover:bg-gradient-to-r hover:from-[#9394A5] hover:via-[#4B65AB] hover:via-[46%] hover:to-[#4B65AB] dark:hover:from-[#243461] dark:hover:via-[#15191c] dark:hover:via-[46%] dark:hover:to-[#15191C]"}`}
              >
                <item.icon className={`w-5 h-5 z-10 ${isCollapsed ? "" : "mr-3"} transition-colors duration-300 ${isActive ? "text-[#E4E5F1]" : "text-[#686868] group-hover:text-[#E4E5F1]"}`} />
                {!isCollapsed && <span className="z-10">{item.label}</span>}
                {isActive && (
                  <div className="overlay absolute dark:top-0 dark:left-0 hidden dark:block">
                    <Image src={stars || "/placeholder.svg"} className="w-full opacity-10" alt="Stars" />
                  </div>
                )}
              </a>
            );
          })}
        </nav>
        {/* Sign Out */}
        <div className={`group px-4 mt-auto mb-5`}>
          <button
            onClick={handleSignOut}
            className={`flex items-center ${isCollapsed ? "justify-center" : ""} w-full px-4 py-3 rounded-lg 
              text-[#686868] dark:text-gray-300 transition-colors duration-300
              hover:text-[#E4E5F1] hover:shadow-[inset_0_1px_4px_rgba(255,255,255,0.2)] hover:outline hover:outline-2 hover:-outline-offset-2 hover:outline-[#D2D3DB]/20 hover:bg-gradient-to-r hover:from-[#9394A5] hover:via-[#4B65AB] hover:via-[46%] hover:to-[#4B65AB] dark:hover:from-[#243461] dark:hover:via-[#15191c] dark:hover:via-[46%] dark:hover:to-[#15191C]`}
          >
            <div className={`p-3 rounded-full ${isCollapsed ? "" : "mr-3"}
              shadow-[inset_0_1px_4px_rgba(255,255,255,0.2)] outline outline-2 -outline-offset-2 outline-[#D2D3DB]/20 bg-gradient-to-r from-[#9394A5] via-[#4B65AB] via-[46%] to-[#4B65AB] dark:from-[#243461] dark:to-[#15191C]
              group-hover:bg-none group-hover:outline-none group-hover:shadow-none transition-all duration-300`}
            >
              <LogOut className={`rotate-180 w-4 h-4 text-[#E4E5F1]`} />
            </div>
            {!isCollapsed && <span>Sign out</span>}
          </button>
        </div>
      </div>
    </div>
  )
}
