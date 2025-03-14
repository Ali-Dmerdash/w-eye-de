"use client";
import { useState } from "react";
import {
  Home,
  BarChart2,
  CreditCard,
  DollarSign,
  Globe,
  Upload,
  LogOut,
  Eye,
  Menu,
  Search,
  User,
} from "lucide-react";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 bg-[#1d2328] rounded-lg text-gray-400 hover:text-white transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div
        id="sidebar"
        className={`fixed top-0 left-0 z-40 h-screen bg-[#1d2328] border-r border-gray-800 transition-all duration-300 ${
          isCollapsed ? "w-16" : "w-64"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* User Profile */}
          <div
            className={`flex items-center px-4 py-6 ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                <User className="w-6 h-6 text-gray-400" />
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#1d2328] rounded-full" />
            </div>
            {!isCollapsed && (
              <div className="flex items-center justify-between flex-1 ml-3">
                <div>
                  <h3 className="text-sm font-medium text-white">Ahmed</h3>
                  <p className="text-xs text-gray-400">Online system admin</p>
                </div>
                <Eye className="w-5 h-5 text-gray-400" />
              </div>
            )}
          </div>

          {/* Search */}
          <div
            className={`px-4 py-4 ${isCollapsed ? "flex justify-center" : ""}`}
          >
            {isCollapsed ? (
              <button className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#1B2131] transition-colors">
                <Search className="w-5 h-5" />
              </button>
            ) : (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search anything..."
                  className="w-full px-4 py-2 bg-[#1B2131] text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute w-4 h-4 text-gray-400 right-3 top-3" />
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 space-y-1">
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
                } px-4 py-3 text-gray-400 rounded-lg hover:bg-[#1B2131] hover:text-white group transition-colors`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span className="ml-3">{item.label}</span>}
              </a>
            ))}
          </nav>

          {/* Sign Out */}
          <div className="p-4">
            <button
              className={`flex items-center ${
                isCollapsed ? "justify-center" : ""
              } w-full px-4 py-3 text-gray-400 rounded-lg hover:bg-[#1B2131] hover:text-white transition-colors`}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="ml-3">Sign out</span>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
