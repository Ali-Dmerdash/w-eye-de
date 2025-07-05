"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Home,
  BarChart2,
  CreditCard,
  DollarSign,
  Globe,
  Upload,
  LogOut
} from "lucide-react";
import Image from "next/image";
import LogoLight from "@/assets/LogoLight.png";
import LogoDark from "@/assets/Logo.png";
import eye from "@/assets/eye.png";
import eyeLight from "@/assets/eyeLight.png";
import stars from "@/assets/nav-stars-bg.png";
import { UserButton, useClerk, useUser } from "@clerk/nextjs";
import { useTheme } from "@/context/ThemeContext";
import { useSidebar } from "@/context/SidebarContext";
import LoadingOverlay from "./LoadingOverlay";


export default function Sidebar() {

  const pathname = usePathname();
  const { isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen } = useSidebar();
  const { signOut } = useClerk();
  const { user, isLoaded } = useUser();
  const { theme } = useTheme();
  const [hasMounted, setHasMounted] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const toggleSidebar = () => {
    if (typeof window !== "undefined" && window.innerWidth < 640) {
      setIsMobileOpen((prev) => !prev);
    } else {
      setIsCollapsed((prev) => {
        document.documentElement.setAttribute("data-sidebar-collapsed", String(!prev));
        return !prev;
      });
    }
  };

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  const navItems = [
    { icon: Home, label: "Home", href: "/home-page" },
    { icon: BarChart2, label: "Statistics", href: "/statistics" },
    { icon: CreditCard, label: "Fraud agent", href: "/fraud-page" },
    { icon: DollarSign, label: "Revenue agent", href: "/revenue-page" },
    { icon: Globe, label: "Global market agent", href: "/market-page" },
    { icon: Upload, label: "Data upload", href: "/upload" }
      ];

  const handleSignOut = () => {
    // Show loading overlay
    setIsLoggingOut(true);

    // Clear localStorage items before signing out
    localStorage.removeItem("chatMessages");
    localStorage.removeItem("theme");
    localStorage.removeItem("sidebar-collapsed");

    // Add a small delay to ensure loading overlay appears
    setTimeout(() => {
      signOut();
    }, 3000);
  };

  return (
    <>
      {isLoggingOut && <LoadingOverlay message="Signing out..." />}
      
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 sm:hidden transition-opacity duration-300 ${
          isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileOpen(false)}
      />
      
      <div
        id="sidebar"
        className={`fixed font-mulish z-50 top-0 left-0 h-screen transition-all duration-300 rounded-e-3xl
          ${isCollapsed ? "w-16" : "w-64"}
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0
          bg-[#E4E5F1] border-r border-gray-300 shadow-[6px_0_16px_0_rgba(44,62,80,0.15)]
          dark:bg-[#1F2937] dark:border-gray-800`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className={`flex items-center ${isCollapsed ? "justify-center px-2 py-4" : "px-6 py-4"}`}>
            {isCollapsed ? (
              <Image
                onClick={toggleSidebar}
                className="cursor-pointer rotate-90"
                src={theme === "dark" ? eye : eyeLight}
                alt="Logo"
              />
            ) : (
              <Image
                src={theme === "dark" ? LogoDark : LogoLight}
                alt="Logo"
                className="w-full"
              />
            )}
          </div>

          {/* User Profile */}
          <div className={`flex items-center ${isCollapsed ? "justify-center px-2 gap-2 flex-col" : "px-6 space-x-3"} py-4  border-b border-gray-300 dark:border-gray-800`}>
            <div className="relative">
              <UserButton
                appearance={{
                  elements: {
                    userButtonPopoverCard: "z-100",
                  },
                }}
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#1d2328] rounded-full" />
            </div>
            {!isCollapsed && isLoaded && user && (
              <div className="flex items-center justify-between flex-1">
                <div>
                  <div className="flex flex-row items-center space-x-0.5">
                    <h3 className="text-sm font-medium text-[#9394A5] dark:text-white">
                      {user.username}
                    </h3>
                    <p className={`text-[0.6rem] ${user.publicMetadata.role === "CEO" ? "bg-red-700 text-red-900 border-red-400" :
                      user.publicMetadata.role === "CTO" ? "bg-blue-700 text-blue-900 border-blue-400" :
                        user.publicMetadata.role === "CFO" ? "bg-green-700 text-green-900 border-green-400"
                          : user.publicMetadata.role === "CMO" ? "bg-yellow-700 text-yellow-900 border-yellow-400"
                            : "bg-gray-700 text-gray-900 border-gray-400"} border px-1 rounded-sm font-bayon`}>
                      {user.publicMetadata.role as string || "N/A"}
                    </p>
                  </div>
                  <p className="text-[0.5rem] text-gray-400 dark:text-gray-400">
                    {user.primaryEmailAddress?.emailAddress.split("@")[0]}
                  </p>
                </div>
                <Image
                  onClick={toggleSidebar}
                  src={theme === "dark" ? eye : eyeLight}
                  className="cursor-pointer"
                  alt="Toggle"
                />
              </div>
            )}
            {isCollapsed ? <p className={`text-[0.6rem] ${user?.publicMetadata.role === "CEO" ? "bg-red-700 text-red-900 border-red-400" :
              user?.publicMetadata.role === "CTO" ? "bg-blue-700 text-blue-900 border-blue-400" :
                user?.publicMetadata.role === "CFO" ? "bg-green-700 text-green-900 border-green-400"
                  : user?.publicMetadata.role === "CMO" ? "bg-yellow-700 text-yellow-900 border-yellow-400"
                    : "bg-gray-700 text-gray-900 border-gray-400"} border px-1.5 rounded-sm font-bayon`}>
              {user?.publicMetadata.role as string || "N/A"}
            </p> : ""}
          </div>


          {/* Navigation */}
          <nav className={`flex-1 pt-5 ${isCollapsed ? "px-2" : "px-4"} space-y-4 overflow-y-auto`}>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={`group flex items-center ${isCollapsed ? "justify-center" : ""
                    } px-4 py-2.5 rounded-lg relative overflow-hidden transition-all duration-300
                  ${isActive
                      ? "text-[#E4E5F1] shadow-[inset_0_1px_4px_rgba(255,255,255,0.2)] dark:outline-none outline outline-2 -outline-offset-2 outline-[#D2D3DB]/20 bg-gradient-to-r from-[#9394A5] via-[#7c3aed] via-[46%] to-[#7c3aed] dark:from-[#4c1d95] dark:via-[#15191c] dark:via-[46%] dark:to-[#15191C]"
                      : "text-[#686868] hover:text-[#E4E5F1] hover:shadow-[inset_0_1px_4px_rgba(255,255,255,0.2)] dark:outline-none hover:outline hover:outline-2 hover:-outline-offset-2 hover:outline-[#D2D3DB]/20 hover:bg-gradient-to-r hover:from-[#9394A5] hover:via-[#7c3aed] hover:via-[46%] hover:to-[#7c3aed] dark:hover:from-[#4c1d95] dark:hover:via-[#15191c] dark:hover:via-[46%] dark:hover:to-[#15191C]"
                    }`}
                >
                  <item.icon
                    className={`w-5 h-5 z-10 ${isCollapsed ? "" : "mr-3"
                      } transition-colors duration-300 ${isActive
                        ? "text-[#E4E5F1]"
                        : "text-[#686868] group-hover:text-[#E4E5F1]"
                      }`}
                  />
                  {!isCollapsed && <span className="z-10">{item.label}</span>}
                  {isActive && (
                    <div className="overlay absolute dark:top-0 dark:left-0 hidden dark:block">
                      <Image src={stars} className="w-full opacity-10" alt="Stars" />
                    </div>
                  )}
                </a>
              );
            })}
          </nav>

          {/* Sign Out */}
          <div className="group px-4 mt-auto mb-5">
            <button
              onClick={handleSignOut}
              className={`flex items-center ${isCollapsed ? "justify-center" : ""
                } w-full px-4 py-3 rounded-2xl border border-transparent
                text-[#686868] dark:text-gray-300 transition-all duration-200 ease-out
                ${!isCollapsed ? "hover:text-purple-600 dark:hover:text-purple-400 hover:border-purple-200 dark:hover:border-purple-800/50 hover:bg-purple-50 dark:hover:bg-purple-900/10 hover:shadow-md hover:shadow-purple-100 dark:hover:shadow-purple-900/20" : "hover:bg-purple-50 dark:hover:bg-purple-900/10"}`}
            >
              <div
                className={`p-3 rounded-full ${isCollapsed ? "" : "mr-3"
                  } shadow-[inset_0_1px_4px_rgba(255,255,255,0.2)] outline outline-2 -outline-offset-2 outline-[#D2D3DB]/20 bg-gradient-to-r from-[#9394A5] via-[#7c3aed] via-[46%] to-[#7c3aed] dark:from-[#4c1d95] dark:to-[#15191C]
                ${!isCollapsed ? "group-hover:bg-none group-hover:outline-none group-hover:shadow-none" : ""} transition-all duration-150`}
              >
                <LogOut className="rotate-180 w-4 h-4 text-[#E4E5F1] group-hover:text-purple-900 dark:text-[#E4E5F1] dark:group-hover:text-[#E4E5F1] transition-colors duration-150" />
              </div>
              {!isCollapsed && <span>Sign out</span>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
