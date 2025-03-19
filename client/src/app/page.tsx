"use client"
import { Briefcase, Users, FileText, ShoppingCart } from "lucide-react"
import Sidebar from "@/components/ui/Sidebar"
import Header from "@/components/ui/Header"
import DashboardCard from "@/app/home_page/components/dashboard-card"
import WelcomeCard from "@/app/home_page/components/welcome-card"
import ReferralCard from "@/app/home_page/components/referal-card"
import ChartCard from "@/app/home_page/components/chart-card"
import SphereVisualization from "@/app/home_page/components/sphere"
export default function Home() {
  return (
    <div className="min-h-screen bg-[#15191c]">
      <Sidebar />
      <Header />
      <div className="p-4 md:p-6 sm:ml-64 pt-20 transition-all duration-300">
        <div className="flex items-center mb-4">
          <p className="text-gray-400 text-sm">Pages / Dashboard</p>
        </div>
        <h1 className="text-white text-xl font-medium mb-6">Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <WelcomeCard name="Amr Ahmed" />
              <ReferralCard score={9.3} />
            </div>
            <ChartCard />
          </div>
          <div className="lg:col-span-1 h-full">
            <SphereVisualization />
          </div>
        </div>
      </div>
    </div>
  )
}

