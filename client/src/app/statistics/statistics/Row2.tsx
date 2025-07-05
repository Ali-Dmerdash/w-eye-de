import React, { useMemo } from "react";
import BoxHeader from "../components/BoxHeader";
import DashboardBox from "../components/DashboardBox";
import FlexBetween from "../components/FlexBetween";
import { kpis, products } from "../data";
import { Activity, DollarSign, PieChart as PieChartIcon, TrendingUp, AlertTriangle } from "lucide-react";
import {
  CartesianGrid,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis,
  Legend,
} from "recharts";
import { useUser } from "@clerk/nextjs"

const pieData = [
  { name: "Revenue", value: 600 },
  { name: "Expenses", value: 400 },
];

const COLORS = ["#7c3aed", "#ef672d", "#a855f7", "#f57c00"];

type Props = {
  section: "d" | "e" | "f";
};

const Row2: React.FC<Props> = ({ section }) => {
  const { user, isLoaded } = useUser();
  const filesUploaded = user?.unsafeMetadata?.filesUploaded;
  if (isLoaded && filesUploaded === false) {
    return (
      <div className="bg-white h-full dark:bg-gray-800 rounded-2xl shadow-lg border border-purple-100 dark:border-gray-700 p-6 flex flex-col items-center justify-center min-h-[200px]">
        <AlertTriangle className="w-8 h-8 text-yellow-500 mb-2" />
        <span className="text-gray-500 dark:text-gray-400 text-center font-medium">
          No data to display — file upload was bypassed.
        </span>
      </div>
    );
  }

  const data = kpis;
  const productData = products;

  const operationalExpenses = useMemo(() => {
    return (
      data &&
      data[0].monthlyData.map(
        ({ month, operationalExpenses, nonOperationalExpenses }) => {
          return {
            name: month.substring(0, 3).charAt(0).toUpperCase() + month.substring(1, 3),
            "Operational Expenses": parseFloat(operationalExpenses.replace("$", "")),
            "Non Operational Expenses": parseFloat(nonOperationalExpenses.replace("$", "")),
          };
        }
      )
    );
  }, [data]);

  const productExpenseData = useMemo(() => {
    return (
      productData &&
      productData.map(({ _id, price, expense }) => {
        return {
          id: _id,
          price: parseFloat(price.replace("$", "")),
          expense: parseFloat(expense.replace("$", "")),
        };
      })
    );
  }, [productData]);

  if (section === "d") {
    return (
      <DashboardBox>
        <BoxHeader
          icon={<Activity size={18} className="text-purple-600 dark:text-purple-400" />}
          title="Operational vs Non-Operational Expenses"
          sideText="Monthly"
        />
        <div className="h-[calc(100%-100px)] p-4 overflow-hidden">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={operationalExpenses}
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
                orientation="left"
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
                // formatter={(value) => [`$${value}`, ""]}
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
                dataKey="Non Operational Expenses"
                stroke="#a855f7"
                dot={{ fill: "#a855f7", r: 3 }}
                activeDot={{ r: 5 }}
                strokeWidth={2}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="Operational Expenses"
                stroke="#ef672d"
                dot={{ fill: "#ef672d", r: 3 }}
                activeDot={{ r: 5 }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </DashboardBox>
    );
  }

  if (section === "e") {
    return (
      <DashboardBox>
        <BoxHeader 
          icon={<PieChartIcon size={18} className="text-purple-600 dark:text-purple-400" />}
          title="Campaigns and Targets" 
          sideText="Yearly" 
        />
        <div className="h-[calc(100%-100px)] p-4">
          <div className="flex justify-between items-center mb-4 px-2">
            <div className="flex flex-col">
              <span className="text-base font-bold text-gray-900 dark:text-white">Target Sales</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Revenue optimization
              </span>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900/30 px-3 py-2 rounded-lg border border-purple-200 dark:border-purple-800/30">
              <span className="text-lg text-purple-600 dark:text-purple-400 font-bold">$83K</span>
            </div>
          </div>
          <div className="h-[calc(100%-60px)]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
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
                  // formatter={(value) => [`$${value}`, ""]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </DashboardBox>
    );
  }

  if (section === "f") {
    return (
      <DashboardBox>
        <BoxHeader 
          icon={<TrendingUp size={18} className="text-purple-600 dark:text-purple-400" />}
          title="Product Prices vs Expenses" 
          sideText="Quarterly" 
        />
        <div className="h-[calc(100%-80px)] p-2 overflow-hidden">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              margin={{
                top: 20,
                right: 20,
                left: 10,
                bottom: 20,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="rgba(124, 58, 237, 0.1)"
              />
              <XAxis
                type="number"
                dataKey="price"
                name="price"
                axisLine={false}
                tickLine={false}
                style={{ fontSize: "10px", fill: "var(--axis-color, #7c3aed)" }}
                tickFormatter={(v) => `$${v}`}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis
                type="number"
                dataKey="expense"
                name="expense"
                axisLine={false}
                tickLine={false}
                style={{ fontSize: "10px", fill: "var(--axis-color, #7c3aed)" }}
                tickFormatter={(v) => `$${v}`}
              />
              <ZAxis type="number" range={[50, 500]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#7c3aed",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                  fontSize: "12px",
                  padding: "8px 12px",
                }}
                formatter={(v) => `$${v}`}
              />
              <Scatter
                name="Product Expense Ratio"
                data={productExpenseData}
                fill="#7c3aed"
                shape="circle"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </DashboardBox>
    );
  }
  
  return null;
};

export default Row2;
