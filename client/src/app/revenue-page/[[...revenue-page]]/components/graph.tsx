"use client"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useEffect, useState } from "react"

const data = [
  { month: "Jan", value1: 180, value2: 500 },
  { month: "Feb", value1: 200, value2: 300 },
  { month: "Mar", value1: 350, value2: 250 },
  { month: "Apr", value1: 400, value2: 300 },
  { month: "May", value1: 450, value2: 350 },
  { month: "Jun", value1: 400, value2: 300 },
  { month: "Jul", value1: 300, value2: 200 },
  { month: "Aug", value1: 350, value2: 250 },
  { month: "Sep", value1: 300, value2: 200 },
  { month: "Oct", value1: 200, value2: 150 },
  { month: "Nov", value1: 400, value2: 300 },
  { month: "Dec", value1: 450, value2: 350 },
]


export default function SalesOverview() {


  return (
    <div className="p-6 bg-[#1d2328] rounded-lg h-full flex flex-col">
      <div className="mb-2">
        <h2 className="text-base font-semibold text-white">Sales overview</h2>
        <p className="text-sm text-emerald-500">(+5) more in 2021</p>
      </div>

      <div className="flex-grow flex">
        <div className="flex-grow">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorValue2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#60A5FA" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF", fontSize: 10 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF", fontSize: 10 }} domain={[0, 600]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                  fontSize: "12px",
                  padding: "4px 8px",
                }}
              />
              <Area type="monotone" dataKey="value1" stroke="#3B82F6" strokeWidth={2} fill="url(#colorValue1)" />
              <Area type="monotone" dataKey="value2" stroke="#60A5FA" strokeWidth={2} fill="url(#colorValue2)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>


      </div>
      
    </div>
  )
}

