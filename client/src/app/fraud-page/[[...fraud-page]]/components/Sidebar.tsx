"use client";
import {
  Home,
  BarChart2,
  CreditCard,
  DollarSign,
  Globe,
  Upload,
  LogOut,
} from "lucide-react";
import Image from "next/image";
import Logo from "@/assets/Logo.png";
import eye from "@/assets/eye.png";
import { FaUserCircle } from "react-icons/fa";

export default function Sidebar() {
  return (
    <div
      id="sidebar"
      className="fixed top-0 left-0 z-40 w-64 h-screen bg-[#1d2328] border-r border-gray-800 transition-transform -translate-x-full sm:translate-x-0"
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center px-6 py-4">
          <Image src={Logo} alt="Logo" className="w-[100%]" />
        </div>

        {/* User Profile */}
        <div className="flex items-center px-6 py-4 space-x-3 border-b border-gray-800">
          <div className="relative">
            <FaUserCircle className="text-gray-400 w-10 h-10" />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#0D1117] rounded-full"></div>
          </div>
          ;
          <div className="flex items-center justify-between flex-1">
            <div>
              <h3 className="text-sm font-medium text-white">Ahmed</h3>
              <p className="text-xs text-gray-400">Test hahahah</p>
            </div>
            <Image src={eye} alt="Logo" />
          </div>
        </div>

        {/* Search */}
        <div className="px-4 py-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search anything..."
              className="w-full px-4 py-2 bg-[#15191c] text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg
              className="absolute w-4 h-4 text-gray-400 right-3 top-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          <a
            href="#"
            className="flex items-center px-4 py-2 text-gray-300 rounded-lg hover:bg-[#1B2131] group"
          >
            <Home className="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-300" />
            <span>Home</span>
          </a>
          <a
            href="#"
            className="flex items-center px-4 py-2 text-gray-300 rounded-lg hover:bg-[#1B2131] group"
          >
            <BarChart2 className="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-300" />
            <span>Statistics</span>
          </a>
          <a
            href="#"
            className="flex items-center px-4 py-2 text-gray-300 rounded-lg hover:bg-[#1B2131] group"
          >
            <CreditCard className="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-300" />
            <span>Fraud agent</span>
          </a>
          <a
            href="#"
            className="flex items-center px-4 py-2 text-gray-300 rounded-lg hover:bg-[#1B2131] group"
          >
            <DollarSign className="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-300" />
            <span>Revenue agent</span>
          </a>
          <a
            href="#"
            className="flex items-center px-4 py-2 text-gray-300 rounded-lg hover:bg-[#1B2131] group"
          >
            <Globe className="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-300" />
            <span>Global market agent</span>
          </a>
          <a
            href="#"
            className="flex items-center px-4 py-2 text-gray-300 rounded-lg hover:bg-[#1B2131] group"
          >
            <Upload className="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-300" />
            <span>Data upload</span>
          </a>
        </nav>

        {/* Sign Out */}
        <div className="p-4 mt-auto">
          <button className="flex items-center justify-center w-full px-4 py-2 space-x-2 text-gray-300 rounded-lg hover:bg-[#1B2131]">
            <LogOut className="w-5 h-5" />
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
