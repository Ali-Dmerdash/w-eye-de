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

const COLORS = ["#7c3aed", "#ef672d", "#a855f7", "#f57c00"];

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
          name: month.substring(0, 3).charAt(0).toUpperCase() + month.substring(1, 3),
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
          icon={<ListOrdered size={18} className="text-purple-600 dark:text-purple-400" />}
          title="Recent Transactions"
          sideText={`${filteredTransactions?.length} latest`}
        />
        <div className="h-[calc(100%-100px)] p-4 overflow-y-auto custom-scrollbar">
          {filteredTransactions && filteredTransactions.map((transaction) => (
            <div
              key={transaction._id}
              className="p-3 my-2 flex items-center justify-between bg-purple-50 dark:bg-gray-700/50 border border-purple-100 dark:border-gray-600 rounded-xl transition-all duration-200 hover:bg-purple-100 dark:hover:bg-gray-600/50 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30 shadow-sm">
                  <CircleDollarSign size={18} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{transaction.buyer}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {transaction.productIds.length} {transaction.productIds.length === 1 ? 'item' : 'items'}
                  </span>
                </div>
              </div>
              <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
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
          icon={<BarChart3 size={18} className="text-purple-600 dark:text-purple-400" />}
          title="Monthly Revenue & Expenses"
          subtitle="Revenue and expenses per month"
          sideText="Monthly"
        />
        <div className="h-[calc(100%-100px)] p-4 overflow-hidden">
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
                    stopColor="#7c3aed"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="#7c3aed"
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
                stroke="rgba(124, 58, 237, 0.1)"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                style={{ fontSize: "10px", fill: "var(--axis-color, #7c3aed)" }}
                tick={{ dx: 0 }}
                tickCount={6}
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
                  backgroundColor: "#7c3aed",
                  border: "none",
                  borderRadius: "12px",
                  color: "#fff",
                  fontSize: "12px",
                  padding: "8px 12px",
                  boxShadow: "0 10px 25px rgba(124, 58, 237, 0.3)",
                }}
                // formatter={(value) => [`$${value}`, ""]}
              />
              <Legend 
                iconType="circle"
                iconSize={8}
                wrapperStyle={{
                  paddingTop: "10px",
                  fontSize: "10px",
                  color: "#7c3aed",
                }}
              />
              <Bar
                dataKey="revenue"
                fill="url(#colorRevenue2)"
                name="Revenue"
                radius={[4, 4, 0, 0]}
                barSize={8}
              />
              <Bar
                dataKey="expenses"
                fill="url(#colorExpenses2)"
                name="Expenses"
                radius={[4, 4, 0, 0]}
                barSize={8}
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
          icon={<PieChartIcon size={18} className="text-purple-600 dark:text-purple-400" />}
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
                  backgroundColor: "#7c3aed",
                  border: "none",
                  borderRadius: "12px",
                  color: "#fff",
                  fontSize: "12px",
                  padding: "8px 12px",
                  boxShadow: "0 10px 25px rgba(124, 58, 237, 0.3)",
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
                  color: "#7c3aed",
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
          icon={<TrendingUp size={18} className="text-purple-600 dark:text-purple-400" />}
          title="Performance Overview"
          sideText={`Q${Math.floor((new Date().getMonth() / 3) + 1)} ${new Date().getFullYear()}`}
        />
        
        <div className="h-[calc(100%-60px)] w-full overflow-hidden p-3">
          {/* Main Summary Card */}
          <div className="bg-purple-50 dark:bg-gray-700/50 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Business Performance</h3>
              <div className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
                <ChevronUp size={12} /> +15%
              </div>
            </div>
            
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              Revenue growth is up by 15% compared to last quarter.
            </p>
            
            <div className="mb-1">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500 dark:text-gray-400">{`Q${Math.floor((new Date().getMonth() / 3) + 1)}`} Goal Progress</span>
                <span className="text-gray-900 dark:text-white font-medium">40%</span>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full w-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full" style={{ width: '40%' }}></div>
              </div>
            </div>
          </div>
          
          {/* Stats Grid - Top Row */}
          <div className="grid grid-cols-3 gap-3 mb-3">
            {/* Revenue */}
            <div className="bg-purple-50 dark:bg-gray-700/50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="w-7 h-7 flex items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20 shadow-sm">
                  <Coins size={14} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-purple-600 dark:text-purple-400">
                  <ChevronUp size={12} /> 12%
                </div>
              </div>
              <div className="mt-2">
                <h4 className="text-xs text-gray-500 dark:text-gray-400">Revenue</h4>
                <p className="text-lg font-bold text-gray-900 dark:text-white">$83K</p>
              </div>
              <div className="mt-2">
                <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full w-full overflow-hidden">
                  <div className="h-full bg-purple-600 rounded-full" style={{ width: '68%' }}></div>
                </div>
              </div>
            </div>
            
            {/* Products */}
            <div className="bg-purple-50 dark:bg-gray-700/50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="w-7 h-7 flex items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20 shadow-sm">
                  <ShoppingBag size={14} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-purple-600 dark:text-purple-400">
                  <ChevronUp size={12} /> 8%
                </div>
              </div>
              <div className="mt-2">
                <h4 className="text-xs text-gray-500 dark:text-gray-400">Products</h4>
                <p className="text-lg font-bold text-gray-900 dark:text-white">8</p>
              </div>
              <div className="mt-2">
                <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full w-full overflow-hidden">
                  <div className="h-full bg-purple-600 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
            </div>
            
            {/* Customers */}
            <div className="bg-purple-50 dark:bg-gray-700/50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="w-7 h-7 flex items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20 shadow-sm">
                  <Users size={14} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-purple-600 dark:text-purple-400">
                  <ChevronUp size={12} /> 5%
                </div>
              </div>
              <div className="mt-2">
                <h4 className="text-xs text-gray-500 dark:text-gray-400">Customers</h4>
                <p className="text-lg font-bold text-gray-900 dark:text-white">2.3K</p>
              </div>
              <div className="mt-2">
                <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full w-full overflow-hidden">
                  <div className="h-full bg-purple-600 rounded-full" style={{ width: '52%' }}></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Stats Grid - Bottom Row */}
          <div className="grid grid-cols-3 gap-3">
            {/* Marketing */}
            <div className="bg-purple-50 dark:bg-gray-700/50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="w-7 h-7 flex items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20 shadow-sm">
                  <BarChart size={14} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-purple-600 dark:text-purple-400">
                  <ChevronUp size={12} /> 4%
                </div>
              </div>
              <div className="mt-2">
                <h4 className="text-xs text-gray-500 dark:text-gray-400">Marketing</h4>
                <p className="text-lg font-bold text-gray-900 dark:text-white">$12K</p>
              </div>
              <div className="mt-2">
                <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full w-full overflow-hidden">
                  <div className="h-full bg-purple-600 rounded-full" style={{ width: '38%' }}></div>
                </div>
              </div>
            </div>
            
            {/* Expenses */}
            <div className="bg-purple-50 dark:bg-gray-700/50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="w-7 h-7 flex items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20 shadow-sm">
                  <PieChart size={14} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-purple-600 dark:text-purple-400">
                  <ChevronUp size={12} /> 7%
                </div>
              </div>
              <div className="mt-2">
                <h4 className="text-xs text-purple-600 dark:text-purple-400">Expenses</h4>
                <p className="text-lg font-bold text-gray-900 dark:text-white">$32K</p>
              </div>
              <div className="mt-2">
                <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full w-full overflow-hidden">
                  <div className="h-full bg-purple-600 rounded-full" style={{ width: '58%' }}></div>
                </div>
              </div>
            </div>
            
            {/* Profit */}
            <div className="bg-purple-50 dark:bg-gray-700/50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="w-7 h-7 flex items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20 shadow-sm">
                  <TrendingUp size={14} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-purple-600 dark:text-purple-400">
                  <ChevronUp size={12} /> 2.5%
                </div>
              </div>
              <div className="mt-2">
                <h4 className="text-xs text-purple-600 dark:text-purple-400">Profit</h4>
                <p className="text-lg font-bold text-gray-900 dark:text-white">24%</p>
              </div>
              <div className="mt-2">
                <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full w-full overflow-hidden">
                  <div className="h-full bg-purple-600 rounded-full" style={{ width: '75%' }}></div>
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
