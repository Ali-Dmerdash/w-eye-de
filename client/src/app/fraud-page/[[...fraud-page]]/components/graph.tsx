"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { clientData, FraudRateGraphData } from "@/data/data"; // Adjust path as needed

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

// Define the chart configuration
const chartConfig = {
  fraudRate: {
    label: "Fraud Rate",
    color: "hsl(var(--accent))", // Base color for fraud rate
  },
} satisfies ChartConfig;

const Graph = () => {
  // Use fraudRateGraphData from the first client
  const fraudRateGraphData: FraudRateGraphData[] =
    clientData[0]?.fraudRateGraphData || [];

  return (
    <Card className="bg-primary">
      <CardHeader>
        <CardTitle className="text-white">Fraud Rate</CardTitle>
        <CardDescription className="text-gray-300">
          trends over the past transactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={fraudRateGraphData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            {/* Updated CartesianGrid stroke to a lighter gray */}
            <CartesianGrid
              vertical={false}
              stroke="rgba(200, 200, 200, 0.5)" // Gray color for dashed lines
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={8}
              tick={{
                fontSize: 12,
                fontWeight: 500,
              }}
              tickFormatter={(value) => value.slice(5)}
            />
            <YAxis
              tickLine={false}
              tickMargin={8}
              domain={[0, 0.25]}
              tick={{
                fill: "hsl(var(--accent))",
                fontSize: 12,
                fontWeight: 500,
              }}
              tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
            />
            <ChartTooltip
              cursor={false}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const fraudRate = payload[0].value;
                  return (
                    <div
                      className="bg-primary p-2 rounded"
                      style={{
                        border: `1px solid ${chartConfig.fraudRate.color}`,
                      }}
                    >
                      <p className="text-gray-300">{label}</p>
                      <p className="text-white font-bold">
                        Fraud Rate:{" "}
                        <span
                          style={{ color: "rgba(0, 123, 255, 1)" }}
                          className="font-semibold"
                        >
                          {typeof fraudRate === "number"
                            ? (fraudRate * 100).toFixed(2)
                            : "N/A"}
                          %
                        </span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              dataKey="fraudRate"
              type="natural"
              fill="hsl(var(--accent))"
              stroke="rgba(119, 112, 250, 0.87)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default Graph;
