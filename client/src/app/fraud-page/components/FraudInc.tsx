"use client";
import { useState } from "react";
import fraudData from "../fraudData.json"; // Import JSON directly

export default function FraudInc() {
  const [fraudDataState, setFraudData] = useState(fraudData); // Set initial state from the imported data

  if (!fraudDataState) return <div className="text-white p-6">Loading...</div>;

  return (
    <div className="bg-[#1d2328] text-white p-6 rounded-lg h-full flex flex-col">
      <div className="bg-[#243461] p-6 rounded-lg text-center mb-6">
        <h2 className="text-lg font-bold tracking-wider text-white mb-2">
          FRAUD INCIDENCE RATE
        </h2>
        <p className="text-5xl font-bold text-red-600">
          {fraudDataState.fraud_metrics.incident_rate}
        </p>
      </div>

      <div className="w-full border-t border-gray-700 mb-6"></div>

      <div className="flex-grow">
        <h3 className="text-lg font-bold mb-4">COMMON FRAUDULENT PATTERNS</h3>
        <ul className="space-y-4">
          {Object.entries(fraudDataState.fraud_metrics.common_patterns).map(
            ([pattern, percentage], index) => (
              <li key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-white">
                    {percentage}
                  </span>
                  <span className="text-gray-400 uppercase text-sm">
                    {pattern}
                  </span>
                </div>
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  );
}
