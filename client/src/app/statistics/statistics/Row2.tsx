import React, { useMemo } from "react";
import BoxHeader from "../components/BoxHeader";
import DashboardBox from "../components/DashboardBox";
import FlexBetween from "../components/FlexBetween";
import { kpis, products } from "../data";
import { Activity, DollarSign, PieChart as PieChartIcon, TrendingUp } from "lucide-react";
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

const pieData = [
  { name: "Revenue", value: 600 },
  { name: "Expenses", value: 400 },
];

const COLORS = ["#4B65AB", "#ef672d", "#4ED7F1", "#f57c00"];

type Props = {
  section: "d" | "e" | "f";
};

const Row2: React.FC<Props> = ({ section }) => {
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
          icon={<Activity size={18} className="text-[#4B65AB] dark:text-[#AEC3FF]" />}
          title="Operational vs Non-Operational Expenses"
          sideText="+4%"
        />
        <div className="h-[calc(100%-80px)] p-2 overflow-hidden">
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
                stroke="rgba(74, 101, 171, 0.1)"
              />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                style={{ fontSize: "10px", fill: "var(--axis-color, #4B65AB)" }}
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
                style={{ fontSize: "10px", fill: "var(--axis-color, #4B65AB)" }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tickLine={false}
                axisLine={false}
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
                height={20}
                iconType="circle"
                iconSize={8}
                wrapperStyle={{
                  paddingTop: "10px",
                  fontSize: "10px",
                  color: "#4B65AB",
                }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="Non Operational Expenses"
                stroke="#4ED7F1"
                dot={{ fill: "#4ED7F1", r: 3 }}
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
          icon={<PieChartIcon size={18} className="text-[#4B65AB] dark:text-[#AEC3FF]" />}
          title="Campaigns and Targets" 
          sideText="+4%" 
        />
        <div className="h-[calc(100%-80px)] p-2">
          <div className="flex justify-between items-center mb-2 px-2">
            <div className="flex flex-col">
              <span className="text-base font-bold text-[#15191c] dark:text-white">Target Sales</span>
              <span className="text-xs text-[#4B65AB] dark:text-gray-400">
                Revenue optimization
              </span>
            </div>
            <div className="bg-[#4B65AB]/20 dark:bg-[#15191c] px-2.5 py-1.5 rounded-lg">
              <span className="text-lg text-[#4B65AB] dark:text-blue-400 font-bold">$83K</span>
            </div>
          </div>
          <div className="h-[calc(100%-40px)]">
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
                    backgroundColor: "#4B65AB",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "12px",
                    padding: "8px 12px",
                  }}
                  formatter={(value) => [`$${value}K`, "Amount"]}
                />
                <Legend 
                  iconType="circle"
                  iconSize={8}
                  layout="horizontal" 
                  verticalAlign="bottom"
                  align="center"
                  wrapperStyle={{
                    fontSize: "12px",
                    color: "#4B65AB",
                    paddingTop: "10px",
                  }}
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
          icon={<TrendingUp size={18} className="text-[#4B65AB] dark:text-[#AEC3FF]" />}
          title="Product Prices vs Expenses" 
          sideText="+4%" 
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
                stroke="rgba(74, 101, 171, 0.1)"
              />
              <XAxis
                type="number"
                dataKey="price"
                name="price"
                axisLine={false}
                tickLine={false}
                style={{ fontSize: "10px", fill: "var(--axis-color, #4B65AB)" }}
                tickFormatter={(v) => `$${v}`}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis
                type="number"
                dataKey="expense"
                name="expense"
                axisLine={false}
                tickLine={false}
                style={{ fontSize: "10px", fill: "var(--axis-color, #4B65AB)" }}
                tickFormatter={(v) => `$${v}`}
              />
              <ZAxis type="number" range={[50, 500]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#4B65AB",
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
                fill="#4B65AB"
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
