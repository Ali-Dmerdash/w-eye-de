"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";

const chartData = [
  { browser: "Fraud Rate", visitors: 275, fill: "hsl(var(--warning-red))" },
  { browser: "Fraud Rate", visitors: 200, fill: "hsl(var(--warning-orange))" },
  { browser: "Fraud Rate", visitors: 287, fill: "hsl(var(--warning-green))" },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--warning-orange))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const biChart = () => {
  const totalVisitors = 20;

  return (
    <Card className="flex flex-col bg-primary border-none shadow-none">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-white">Transactions-categorizing</CardTitle>
        <CardDescription className="text-white">
          January - June 2024
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={({ payload, active }) => {
                if (active && payload && payload.length > 0) {
                  return (
                    <div className="flex items-center gap-2 p-2 bg-white shadow-md rounded-md border">
                      <div
                        className="w-3 h-3 rounded-sm"
                        style={{ backgroundColor: payload[0].payload.fill }}
                      ></div>
                      <span className="text-gray-700">{payload[0].name}</span>
                      <span className="ml-auto font-semibold text-gray-900">
                        {payload[0].value}
                      </span>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={60}
              outerRadius={100}
              stroke="none" // Removes the white border
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="text-white"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="text-3xl font-bold"
                          fill="white" // Ensures white text
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="text-sm"
                          fill="white" // Ensures white text
                        >
                          Transactions
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
export default biChart;
