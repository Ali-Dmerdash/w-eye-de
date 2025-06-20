"use client";
import { Briefcase, Users, FileText, ShoppingCart, Settings, RotateCcw, Maximize2, X } from "lucide-react";
import { useEffect, useState } from "react";
import Sidebar from "@/components/ui/Sidebar";
import Header from "@/components/ui/Header";
import DashboardCard from "./components/dashboard-card";
import WelcomeCard from "./components/welcome-card";
import ReferralCard from "./components/referal-card";
import ChartCard from "./components/chart-card";
import {KPIDashboard} from "@/app/sphere/kpi-dashboard";
import { KPISettingsPanel } from "@/app/sphere/kpi-settings-panel";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";
import { calculateKPIStatus, initialKPIs } from "@/app/sphere/page";
import { createPortal } from "react-dom";

export default function Home() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const { theme } = useTheme();

  // KPI sphere state
  const [kpis, setKPIs] = useState(initialKPIs.map(kpi => ({
    ...kpi,
    status: calculateKPIStatus(kpi),
  })));
  const [showSettings, setShowSettings] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const styleMode = 'wireframe';

  const updateKPIImportance = (id: number, importance: number) => {
    setKPIs((prev) => prev.map((kpi) => (kpi.id === id ? { ...kpi, importance } : kpi)))
  }

  const updateKPIRelevance = (id: number, relevance: number) => {
    setKPIs((prev) => prev.map((kpi) => (kpi.id === id ? { ...kpi, relevanceToOverall: relevance } : kpi)))
  }

  const resetRotation = () => {
    setResetTrigger((prev) => prev + 1)
  }

  const overallStatus = () => {
    const goodCount = kpis.filter((kpi) => kpi.status === "good").length
    const warningCount = kpis.filter((kpi) => kpi.status === "warning").length
    const criticalCount = kpis.filter((kpi) => kpi.status === "critical").length

    if (criticalCount > 0) return "critical"
    if (warningCount > goodCount / 2) return "warning"
    return "good"
  }

  // Handle Esc to exit fullscreen
  useEffect(() => {
    if (!fullscreen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [fullscreen]);

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

  // Trigger animations on component mount
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const getKPIStats = () => {
    const total = kpis.length
    const good = kpis.filter((kpi) => kpi.status === "good").length
    const warning = kpis.filter((kpi) => kpi.status === "warning").length
    const critical = kpis.filter((kpi) => kpi.status === "critical").length
    return { total, good, warning, critical }
  }

  const stats = getKPIStats()

  return (
    <div className={`min-h-screen transition-colors duration-300 dark:bg-[#15191c] bg-[#FAFAFA] relative`}>
      <Sidebar />
      <Header />
      <div
        className={`p-4 md:p-6 pt-8 transition-all duration-300 
        ${isCollapsed ? "sm:ml-16" : "sm:ml-64"}`}
      >

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          <div className={`transform transition-all duration-500 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
            <DashboardCard
              title="Today's Money"
              value="$53,000"
              change="+55%"
              changeType="positive"
              icon={<Briefcase className="w-5 h-5 text-white" />}
              iconBg="bg-blue-500"
            />
          </div>
          <div className={`transform transition-all duration-500 ease-out delay-100 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
            <DashboardCard
              title="Today's Users"
              value="2,300"
              change="+5%"
              changeType="positive"
              icon={<Users className="w-5 h-5 text-white" />}
              iconBg="bg-blue-500"
            />
          </div>
          <div className={`transform transition-all duration-500 ease-out delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
            <DashboardCard
              title="New Clients"
              value="+3,052"
              change="-14%"
              changeType="negative"
              icon={<FileText className="w-5 h-5 text-white" />}
              iconBg="bg-blue-500"
            />
          </div>
          <div className={`transform transition-all duration-500 ease-out delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
            <DashboardCard
              title="Total Sales"
              value="$173,000"
              change="+8%"
              changeType="positive"
              icon={<ShoppingCart className="w-5 h-5 text-white" />}
              iconBg="bg-blue-500"
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          <div className="col-span-4 lg:col-span-2 space-y-6">
            <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
              <div className={`transform transition-all duration-500 ease-out delay-400 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}>
                <WelcomeCard />
              </div>
              <div className={`transform transition-all duration-500 ease-out delay-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}>
                <ReferralCard score={9.3} />
              </div>
            </div>
            <div className={`transform transition-all duration-500 ease-out delay-600 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
              <ChartCard />
            </div>
          </div>
          <div className={`hidden lg:block lg:col-span-2 h-full transform transition-all duration-500 ease-out delay-700 relative ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
            <div className="absolute right-0 z-10 flex gap-2 items-center">
              <div className={`${theme === 'dark' ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-sm rounded-lg p-4 ${theme === 'dark' ? 'text-white' : 'text-black'} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} shadow-md`}>
                <h3 className="text-sm font-medium mb-2">Overall Status</h3>
                <div
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mb-3 ${
                    overallStatus() === "good"
                      ? theme === 'dark' ? "bg-green-500/20 text-green-300" : "bg-green-500/20 text-green-700"
                      : overallStatus() === "warning"
                        ? theme === 'dark' ? "bg-yellow-500/20 text-yellow-300" : "bg-yellow-500/20 text-yellow-700"
                        : theme === 'dark' ? "bg-red-500/20 text-red-300" : "bg-red-500/20 text-red-700"
                    }`}
                >
                  {overallStatus() === "good"
                    ? "● Excellent"
                    : overallStatus() === "warning"
                      ? "● Needs Attention"
                      : "● Critical"}
                </div>
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className={theme === 'dark' ? "text-gray-300" : "text-gray-600"}>Total KPIs:</span>
                    <span className="font-medium">{stats.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={theme === 'dark' ? "text-purple-700" : "text-purple-600"}>Good:</span>
                    <span className="font-medium">{stats.good}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={theme === 'dark' ? "text-yellow-300" : "text-yellow-600"}>Warning:</span>
                    <span className="font-medium">{stats.warning}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={theme === 'dark' ? "text-red-300" : "text-red-600"}>Critical:</span>
                    <span className="font-medium">{stats.critical}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute left-0 z-10 flex gap-2">
              <Button
                onClick={() => setFullscreen(true)}
                variant="outline"
                size="sm"
                className={`${theme === 'dark' 
                  ? 'bg-gray-900/95 border-gray-700 text-white hover:bg-gray-800 hover:border-blue-500/50 hover:text-blue-300' 
                  : 'bg-white/95 border-gray-200 text-black hover:bg-gray-50 hover:border-blue-500/50 hover:text-blue-600'} 
                  backdrop-blur-sm shadow-md transition-all duration-200`}
              >
                <Maximize2 className="w-4 h-4 mr-2" />
                Fullscreen
              </Button>
              <Button
                onClick={() => setShowSettings(!showSettings)}
                variant="outline"
                size="sm"
                className={`${theme === 'dark' 
                  ? 'bg-gray-900/95 border-gray-700 text-white hover:bg-gray-800 hover:border-blue-500/50 hover:text-blue-300' 
                  : 'bg-white/95 border-gray-200 text-black hover:bg-gray-50 hover:border-blue-500/50 hover:text-blue-600'} 
                  backdrop-blur-sm shadow-md transition-all duration-200`}
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button
                onClick={resetRotation}
                variant="outline"
                size="sm"
                className={`${theme === 'dark' 
                  ? 'bg-gray-900/95 border-gray-700 text-white hover:bg-gray-800 hover:border-blue-500/50 hover:text-blue-300' 
                  : 'bg-white/95 border-gray-200 text-black hover:bg-gray-50 hover:border-blue-500/50 hover:text-blue-600'} 
                  backdrop-blur-sm shadow-md transition-all duration-200`}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset View
              </Button>
            </div>

            <KPIDashboard
              kpis={kpis}
              overallStatus={overallStatus()}
              resetTrigger={resetTrigger}
              envPreset={theme === "dark" ? "night" : "city"}
              styleMode="wireframe"
            />
          </div>
        </div>
      </div>

      {/* KPI Settings Panel - This will appear over the entire page */}
      {showSettings && (
        <KPISettingsPanel
          kpis={kpis}
          onUpdateImportance={updateKPIImportance}
          onUpdateRelevance={updateKPIRelevance}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Fullscreen Modal */}
      {fullscreen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center transition-all duration-500 animate-fade-in">
          <button
            onClick={() => setFullscreen(false)}
            className={`absolute top-4 right-4 p-2 rounded-lg ${theme === 'dark' 
              ? 'bg-gray-900/95 border-gray-700 hover:bg-gray-800 hover:border-blue-500/50 hover:text-blue-300' 
              : 'bg-white/95 border-gray-200 hover:bg-gray-50 hover:border-blue-500/50 hover:text-blue-600'} 
              backdrop-blur-sm shadow-md border transition-all duration-200 z-10`}
            title="Exit Fullscreen"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="w-full h-full flex-1">
            <KPIDashboard
              kpis={kpis}
              overallStatus={overallStatus()}
              resetTrigger={resetTrigger}
              envPreset={theme === "dark" ? "night" : "city"}
              styleMode="wireframe"
            />
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
