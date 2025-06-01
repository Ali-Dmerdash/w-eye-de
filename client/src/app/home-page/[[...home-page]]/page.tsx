"use client";
import { Briefcase, Users, FileText, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import Sidebar from "@/components/ui/Sidebar";
import Header from "@/components/ui/Header";
import DashboardCard from "./components/dashboard-card";
import WelcomeCard from "./components/welcome-card";
import ReferralCard from "./components/referal-card";
import ChartCard from "./components/chart-card";
import SphereVisualization from "./components/sphere";
import { useTheme } from "@/context/ThemeContext";

export default function Home() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { theme } = useTheme();

  // Listen for changes to the sidebar state
  useEffect(() => {
    const updateSidebarState = () => {
      const isCollapsed =
        document.documentElement.getAttribute("data-sidebar-collapsed") ===
        "true";
      setIsCollapsed(isCollapsed);
    };

    // Initial check
    updateSidebarState();

    // Set up a mutation observer to watch for attribute changes
    const observer = new MutationObserver(updateSidebarState);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-sidebar-collapsed"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-300 dark:bg-[#15191c] bg-[#FAFAFA]`}>
      <Sidebar />
      <Header />
      <div
        className={`p-4 md:p-6 pt-8 transition-all duration-300 
        ${isCollapsed ? "sm:ml-16" : "sm:ml-64"}`}
      >
        <div className="flex items-center mb-4">
          <p className="text-gray-400 text-sm">Pages / Dashboard</p>
        </div>
        <h1 className="dark:text-white text-gray-700 text-xl font-medium mb-6">Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          <DashboardCard
            title="Today's Money"
            value="$53,000"
            change="+55%"
            changeType="positive"
            icon={<Briefcase className="w-5 h-5 text-white" />}
            iconBg="bg-blue-500"
          />
          <DashboardCard
            title="Today's Users"
            value="2,300"
            change="+5%"
            changeType="positive"
            icon={<Users className="w-5 h-5 text-white" />}
            iconBg="bg-blue-500"
          />
          <DashboardCard
            title="New Clients"
            value="+3,052"
            change="-14%"
            changeType="negative"
            icon={<FileText className="w-5 h-5 text-white" />}
            iconBg="bg-blue-500"
          />
          <DashboardCard
            title="Total Sales"
            value="$173,000"
            change="+8%"
            changeType="positive"
            icon={<ShoppingCart className="w-5 h-5 text-white" />}
            iconBg="bg-blue-500"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          <div className="col-span-4 lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <WelcomeCard />
              <ReferralCard score={9.3} />
            </div>
            <ChartCard />
          </div>
          <div className="hidden lg:block lg:col-span-2 h-full">
            <SphereVisualization />
          </div>
        </div>
      </div>
    </div>
  );
}
