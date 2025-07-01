import React, { useMemo } from "react";
import BoxHeader from "../components/BoxHeader";
import DashboardBox from "../components/DashboardBox";
import { kpis } from "../data";
import { BarChart3, LineChart as LineChartIcon, AreaChart as AreaChartIcon, PieChart as PieChartIcon, TrendingUp, PieChart, BarChart2 } from "lucide-react";
import {
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  BarChart,
  Bar,
  LineChart,
  XAxis,
  YAxis,
  Legend,
  Line,
  Tooltip,
  Area,
} from "recharts";
import { useUser } from "@clerk/nextjs"
import { AlertTriangle } from "lucide-react"

type Props = {
  section: "a" | "b" | "c";
};

const Row1: React.FC<Props> = ({ section }) => {
  const { user, isLoaded } = useUser();
  const filesUploaded = user?.unsafeMetadata?.filesUploaded;
  if (isLoaded && filesUploaded === false) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-purple-100 dark:border-gray-700 p-6 flex flex-col items-center justify-center min-h-[200px]">
        <AlertTriangle className="w-8 h-8 text-yellow-500 mb-2" />
        <span className="text-gray-500 dark:text-gray-400 text-center font-medium">
          No data to display — file upload was bypassed.
        </span>
      </div>
    );
  }

  const data = kpis;

  const revenue = useMemo(() => {
    return (
      data &&
      data[0].monthlyData.map(({ month, revenue }) => {
        return {
          name: month.substring(0, 3).charAt(0).toUpperCase() + month.substring(1, 3),
          revenue: parseFloat(revenue.replace("$", "")),
        };
      })
    );
  }, [data]);

  const revenueExpenses = useMemo(() => {
    return (
      data &&
      data[0].monthlyData.map(({ month, revenue, expenses }) => {
        return {
          name: month.substring(0, 3).charAt(0).toUpperCase() + month.substring(1, 3),
          revenue: parseFloat(revenue.replace("$", "")),
          expenses: parseFloat(expenses.replace("$", "")),
        };
      })
    );
  }, [data]);

  const revenueProfit = useMemo(() => {
    return (
      data &&
      data[0].monthlyData.map(({ month, revenue, expenses }) => {
        return {
          name: month.substring(0, 3).charAt(0).toUpperCase() + month.substring(1, 3),
          revenue: parseFloat(revenue.replace("$", "")),
          profit: (parseFloat(revenue.replace("$", "")) - parseFloat(expenses.replace("$", ""))).toFixed(2),
        };
      })
    );
  }, [data]);

  if (section === "a") {
    return (
      <DashboardBox>
        <BoxHeader
          icon={<AreaChartIcon size={18} className="text-purple-600 dark:text-purple-400" />}
          title="Revenue and Expenses"
          subtitle="top line represents revenue, bottom line represents expenses"
          sideText="Monthly"
        />
        <div className="h-[calc(100%-100px)] p-4 overflow-hidden">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={revenueExpenses}
              margin={{
                top: 15,
                right: 25,
                left: 10,
                bottom: 20,
              }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="#7c3aed"
                    stopOpacity={0.6}
                  />
                  <stop
                    offset="95%"
                    stopColor="#7c3aed"
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="#a855f7"
                    stopOpacity={0.6}
                  />
                  <stop
                    offset="95%"
                    stopColor="#a855f7"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="rgba(124, 58, 237, 0.1)"
              />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                style={{ fontSize: "10px", fill: "var(--axis-color, #7c3aed)" }}
                padding={{ left: 10, right: 10 }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                style={{ fontSize: "10px", fill: "var(--axis-color, #7c3aed)" }}
                domain={[8000, 23000]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "none",
                  borderRadius: "12px",
                  color: "#fff",
                  fontSize: "12px",
                  padding: "8px 12px",
                  boxShadow: "0 10px 25px rgba(124, 58, 237, 0.3)",
                }}
                // formatter={(value) => [`$${value}`, ""]}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                dot={{ fill: "#7c3aed", r: 3 }}
                activeDot={{ r: 5 }}
                stroke="#7c3aed"
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
              <Area
                type="monotone"
                dataKey="expenses"
                dot={{ fill: "#a855f7", r: 3 }}
                activeDot={{ r: 5 }}
                stroke="#a855f7"
                fillOpacity={1}
                fill="url(#colorExpenses)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </DashboardBox>
    );
  }

  if (section === "b") {
    return (
      <DashboardBox>
        <BoxHeader
          icon={<LineChartIcon size={18} className="text-purple-600 dark:text-purple-400" />}
          title="Profit and Revenue"
          subtitle="top line represents revenue, bottom line represents expenses"
          sideText="Monthly"
        />
        <div className="h-[calc(100%-100px)] p-4 overflow-hidden">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={revenueProfit}
              margin={{
                top: 20,
                right: 20,
                left: 10,
                bottom: 60,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="rgba(124, 58, 237, 0.1)"
              />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                style={{ fontSize: "10px", fill: "var(--axis-color, #7c3aed)" }}
                padding={{ left: 10, right: 10 }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                yAxisId="left"
                tickLine={false}
                axisLine={false}
                style={{ fontSize: "10px", fill: "var(--axis-color, #7c3aed)" }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tickLine={false}
                axisLine={false}
                style={{ fontSize: "10px", fill: "var(--axis-color, #7c3aed)" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "none",
                  borderRadius: "12px",
                  color: "#fff",
                  fontSize: "12px",
                  padding: "8px 12px",
                  boxShadow: "0 10px 25px rgba(124, 58, 237, 0.3)",
                }}
                formatter={(value) => [`$${value}`, ""]}
              />
              <Legend
                height={20}
                iconType="circle"
                iconSize={8}
                wrapperStyle={{
                  paddingTop: "10px",
                  fontSize: "10px",
                  color: "#7c3aed",
                }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="profit"
                stroke="#ef672d"
                dot={{ fill: "#ef672d", r: 3 }}
                activeDot={{ r: 5 }}
                strokeWidth={2}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="revenue"
                stroke="#7c3aed"
                dot={{ fill: "#7c3aed", r: 3 }}
                activeDot={{ r: 5 }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </DashboardBox>
    );
  }

  if (section === "c") {
    return (
      <DashboardBox>
        <BoxHeader
          icon={<BarChart3 size={18} className="text-purple-600 dark:text-purple-400" />}
          title="Revenue Month by Month"
          subtitle="graph representing the revenue month by month"
          sideText="Monthly"
        />
        <div className="h-[calc(100%-100px)] p-4 overflow-hidden">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={revenue}
              margin={{
                top: 20,
                right: 20,
                left: 10,
                bottom: 60,
              }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="#7c3aed"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="#7c3aed"
                    stopOpacity={0.2}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="rgba(124, 58, 237, 0.1)"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                style={{ fontSize: "10px", fill: "var(--axis-color, #7c3aed)" }}
                padding={{ left: 10, right: 10 }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                style={{ fontSize: "10px", fill: "var(--axis-color, #7c3aed)" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "none",
                  borderRadius: "12px",
                  color: "#fff",
                  fontSize: "12px",
                  padding: "8px 12px",
                  boxShadow: "0 10px 25px rgba(124, 58, 237, 0.3)",
                }}
                // formatter={(value) => [`$${value}`, ""]}
              />
              <Bar 
                dataKey="revenue" 
                fill="url(#colorRevenue)"
                radius={[4, 4, 0, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </DashboardBox>
    );
  }
  
  return null;
};

export default Row1;
