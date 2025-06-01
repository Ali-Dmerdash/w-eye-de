import React, { useMemo } from "react";
import BoxHeader from "../components/BoxHeader";
import DashboardBox from "../components/DashboardBox";
import FlexBetween from "../components/FlexBetween";
import { kpis } from "../data";
import { transactions } from "../transactions";
import { products } from "../products";
import { BarChart3, CircleDollarSign, ListOrdered, PieChartIcon, TrendingUp, ArrowUpCircle, Coins, Users, ShoppingBag, BarChart, PieChart, ChevronUp } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  XAxis,
  YAxis,
  Line,
  CartesianGrid,
  Tooltip,
  BarChart as RechartsBarChart,
  Bar,
  Legend,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts";

type Props = {
  section: "g" | "h" | "i" | "j";
};

const COLORS = ["#4B65AB", "#ef672d", "#4ED7F1", "#f57c00"];

const pieData = [
  { name: "Operational", value: 30 },
  { name: "Non-Operational", value: 25 },
  { name: "Other", value: 45 },
];

const Row3: React.FC<Props> = ({ section }) => {
  const data = kpis;
  const transactionData = transactions;

  const monthlyData = useMemo(() => {
    return (
      data &&
      data[0].monthlyData.map(({ month, revenue, expenses }) => {
        return {
          name: month.substring(0, 3),
          revenue: parseFloat(revenue.replace("$", "")),
          expenses: parseFloat(expenses.replace("$", "")),
        };
      })
    );
  }, [data]);

  const filteredTransactions = useMemo(() => {
    return transactionData?.slice(0, 8);
  }, [transactionData]);

  if (section === "g") {
    return (
      <DashboardBox>
        <BoxHeader
          icon={<ListOrdered size={18} className="text-[#4B65AB] dark:text-[#AEC3FF]" />}
          title="Recent Transactions"
          sideText={`${filteredTransactions?.length} latest`}
        />
        <div className="h-[calc(100%-80px)] p-2 overflow-y-auto custom-scrollbar">
          {filteredTransactions && filteredTransactions.map((transaction) => (
            <div
              key={transaction._id}
              className="p-3 my-1.5 flex items-center justify-between bg-[#4B65AB]/10 dark:bg-[#15191c] border border-[#4B65AB]/20 dark:border-gray-700/20 rounded-lg transition-colors hover:bg-[#4B65AB]/15 dark:hover:bg-[#15191c]/80"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#4B65AB]/30 dark:bg-[#1d2328]">
                  <CircleDollarSign size={16} className="text-[#4B65AB] dark:text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-[#15191c] dark:text-white">{transaction.buyer}</span>
                  <span className="text-xs text-[#4B65AB] dark:text-gray-400">
                    {transaction.productIds.length} {transaction.productIds.length === 1 ? 'item' : 'items'}
                  </span>
                </div>
              </div>
              <span className="text-sm font-bold text-[#4B65AB] dark:text-blue-400">
                {transaction.cost}
              </span>
            </div>
          ))}
        </div>
      </DashboardBox>
    );
  }

  if (section === "h") {
    return (
      <DashboardBox>
        <BoxHeader
          icon={<BarChart3 size={18} className="text-[#4B65AB] dark:text-[#AEC3FF]" />}
          title="Monthly Revenue & Expenses"
          subtitle="Revenue and expenses per month"
          sideText="+4%"
        />
        <div className="h-[calc(100%-80px)] p-2 overflow-hidden">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart
              data={monthlyData}
              margin={{
                top: 10,
                right: 10,
                left: 10,
                bottom: 20,
              }}
              barGap={6}
            >
              <defs>
                <linearGradient id="colorRevenue2" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="#4B65AB"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="#4B65AB"
                    stopOpacity={0.2}
                  />
                </linearGradient>
                <linearGradient id="colorExpenses2" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="#ef672d"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="#ef672d"
                    stopOpacity={0.2}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="rgba(74, 101, 171, 0.1)"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                style={{ fontSize: "10px", fill: "var(--axis-color, #4B65AB)" }}
                tick={{ dx: 0 }}
                tickCount={6}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                style={{ fontSize: "10px", fill: "var(--axis-color, #4B65AB)" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#4B65AB",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                  fontSize: "12px",
                  padding: "8px 12px",
                }}
                formatter={(value) => [`$${value}`, ""]}
              />
              <Legend 
                iconType="circle"
                iconSize={8}
                wrapperStyle={{
                  paddingTop: "10px",
                  fontSize: "10px",
                  color: "#4B65AB",
                }}
              />
              <Bar
                dataKey="revenue"
                fill="url(#colorRevenue2)"
                name="Revenue"
                radius={[4, 4, 0, 0]}
                barSize={6}
              />
              <Bar
                dataKey="expenses"
                fill="url(#colorExpenses2)"
                name="Expenses"
                radius={[4, 4, 0, 0]}
                barSize={6}
              />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </DashboardBox>
    );
  }

  if (section === "i") {
    return (
      <DashboardBox>
        <BoxHeader
          icon={<PieChartIcon size={18} className="text-[#4B65AB] dark:text-[#AEC3FF]" />}
          title="Expense Breakdown By Category"
          sideText="+4%"
        />
        <div className="h-[calc(100%-80px)] p-2 overflow-hidden">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#4B65AB",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                  fontSize: "12px",
                  padding: "8px 12px",
                }}
              />
              <Legend 
                iconType="circle"
                iconSize={8}
                layout="vertical" 
                verticalAlign="middle"
                align="right"
                wrapperStyle={{
                  fontSize: "12px",
                  color: "#4B65AB",
                  paddingRight: "20px",
                }}
              />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </DashboardBox>
    );
  }

  if (section === "j") {
    return (
      <DashboardBox className="h-full">
        <BoxHeader
          icon={<TrendingUp size={18} className="text-[#4B65AB] dark:text-[#AEC3FF]" />}
          title="Performance Overview"
          sideText="Q1 2023"
        />
        
        <div className="h-[calc(100%-60px)] w-full overflow-hidden p-3">
          {/* Main Summary Card */}
          <div className="bg-[#4B65AB]/10 dark:bg-[#15191c] rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-[#15191c] dark:text-white">Business Performance</h3>
              <div className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-[#4B65AB]/20 dark:bg-[#1d2328] text-[#4B65AB] dark:text-blue-400">
                <ChevronUp size={12} /> +15%
              </div>
            </div>
            
            <p className="text-xs text-[#4B65AB] dark:text-gray-300 mb-3">
              Revenue growth is up by 15% compared to last quarter.
            </p>
            
            <div className="mb-1">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#4B65AB] dark:text-gray-400">Q1 Goal Progress</span>
                <span className="text-[#15191c] dark:text-white font-medium">40%</span>
              </div>
              <div className="h-2 bg-[#f8fafc] dark:bg-[#1B2131] rounded-full w-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#4B65AB] to-[#AEC3FF] rounded-full" style={{ width: '40%' }}></div>
              </div>
            </div>
          </div>
          
          {/* Stats Grid - Top Row */}
          <div className="grid grid-cols-3 gap-3 mb-3">
            {/* Revenue */}
            <div className="bg-[#4B65AB]/5 dark:bg-[#15191c] rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="w-7 h-7 flex items-center justify-center rounded-full bg-[#4B65AB]/20 dark:bg-[#1d2328]">
                  <Coins size={14} className="text-[#4B65AB] dark:text-[#AEC3FF]" />
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-[#4B65AB] dark:text-[#AEC3FF]">
                  <ChevronUp size={12} /> 12%
                </div>
              </div>
              <div className="mt-2">
                <h4 className="text-xs text-[#4B65AB] dark:text-gray-400">Revenue</h4>
                <p className="text-lg font-bold text-[#15191c] dark:text-white">$83K</p>
              </div>
              <div className="mt-2">
                <div className="h-1.5 bg-[#f8fafc] dark:bg-[#1B2131] rounded-full w-full overflow-hidden">
                  <div className="h-full bg-[#4B65AB] rounded-full" style={{ width: '68%' }}></div>
                </div>
              </div>
            </div>
            
            {/* Products */}
            <div className="bg-[#4B65AB]/5 dark:bg-[#15191c] rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="w-7 h-7 flex items-center justify-center rounded-full bg-[#4B65AB]/20 dark:bg-[#1d2328]">
                  <ShoppingBag size={14} className="text-[#4B65AB] dark:text-[#AEC3FF]" />
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-[#4B65AB] dark:text-[#AEC3FF]">
                  <ChevronUp size={12} /> 8%
                </div>
              </div>
              <div className="mt-2">
                <h4 className="text-xs text-[#4B65AB] dark:text-gray-400">Products</h4>
                <p className="text-lg font-bold text-[#15191c] dark:text-white">8</p>
              </div>
              <div className="mt-2">
                <div className="h-1.5 bg-[#f8fafc] dark:bg-[#1B2131] rounded-full w-full overflow-hidden">
                  <div className="h-full bg-[#4B65AB] rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
            </div>
            
            {/* Customers */}
            <div className="bg-[#4B65AB]/5 dark:bg-[#15191c] rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="w-7 h-7 flex items-center justify-center rounded-full bg-[#4B65AB]/20 dark:bg-[#1d2328]">
                  <Users size={14} className="text-[#4B65AB] dark:text-[#AEC3FF]" />
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-[#4B65AB] dark:text-[#AEC3FF]">
                  <ChevronUp size={12} /> 5%
                </div>
              </div>
              <div className="mt-2">
                <h4 className="text-xs text-[#4B65AB] dark:text-gray-400">Customers</h4>
                <p className="text-lg font-bold text-[#15191c] dark:text-white">2.3K</p>
              </div>
              <div className="mt-2">
                <div className="h-1.5 bg-[#f8fafc] dark:bg-[#1B2131] rounded-full w-full overflow-hidden">
                  <div className="h-full bg-[#4B65AB] rounded-full" style={{ width: '52%' }}></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Stats Grid - Bottom Row */}
          <div className="grid grid-cols-3 gap-3">
            {/* Marketing */}
            <div className="bg-[#4B65AB]/5 dark:bg-[#15191c] rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="w-7 h-7 flex items-center justify-center rounded-full bg-[#4B65AB]/20 dark:bg-[#1d2328]">
                  <BarChart size={14} className="text-[#4B65AB] dark:text-[#AEC3FF]" />
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-[#4B65AB] dark:text-[#AEC3FF]">
                  <ChevronUp size={12} /> 4%
                </div>
              </div>
              <div className="mt-2">
                <h4 className="text-xs text-[#4B65AB] dark:text-gray-400">Marketing</h4>
                <p className="text-lg font-bold text-[#15191c] dark:text-white">$12K</p>
              </div>
              <div className="mt-2">
                <div className="h-1.5 bg-[#f8fafc] dark:bg-[#1B2131] rounded-full w-full overflow-hidden">
                  <div className="h-full bg-[#4B65AB] rounded-full" style={{ width: '38%' }}></div>
                </div>
              </div>
            </div>
            
            {/* Expenses */}
            <div className="bg-[#ef672d]/5 dark:bg-[#15191c] rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="w-7 h-7 flex items-center justify-center rounded-full bg-[#ef672d]/20 dark:bg-[#1d2328]">
                  <PieChart size={14} className="text-[#ef672d] dark:text-[#ef672d]" />
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-[#ef672d]">
                  <ChevronUp size={12} /> 7%
                </div>
              </div>
              <div className="mt-2">
                <h4 className="text-xs text-[#ef672d]">Expenses</h4>
                <p className="text-lg font-bold text-[#15191c] dark:text-white">$32K</p>
              </div>
              <div className="mt-2">
                <div className="h-1.5 bg-[#f8fafc] dark:bg-[#1B2131] rounded-full w-full overflow-hidden">
                  <div className="h-full bg-[#ef672d] rounded-full" style={{ width: '58%' }}></div>
                </div>
              </div>
            </div>
            
            {/* Profit */}
            <div className="bg-[#4B65AB]/5 dark:bg-[#15191c] rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="w-7 h-7 flex items-center justify-center rounded-full bg-[#4B65AB]/20 dark:bg-[#1d2328]">
                  <TrendingUp size={14} className="text-[#4B65AB] dark:text-[#AEC3FF]" />
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-[#4B65AB] dark:text-[#AEC3FF]">
                  <ChevronUp size={12} /> 2.5%
                </div>
              </div>
              <div className="mt-2">
                <h4 className="text-xs text-[#4B65AB] dark:text-gray-400">Profit</h4>
                <p className="text-lg font-bold text-[#15191c] dark:text-white">24%</p>
              </div>
              <div className="mt-2">
                <div className="h-1.5 bg-[#f8fafc] dark:bg-[#1B2131] rounded-full w-full overflow-hidden">
                  <div className="h-full bg-[#4B65AB] rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardBox>
    );
  }
  
  return null;
};

export default Row3;
