"use client";
import { useState } from "react";
import fraudData from "../fraudData.json"; // Import JSON directly

export default function FraudInc() {
  // Set initial state from the imported data
  // Note: Using useState like the old version, although direct usage might also work
  // depending on how often the data might theoretically change.
  const [fraudDataState, setFraudData] = useState(fraudData);

  // Added a check for data loading, similar to the old version
  if (!fraudDataState) return <div className="text-white p-6">Loading...</div>;

  return (
    <div className="bg-[#1d2328] text-white font-bayon p-6 rounded-lg h-full flex flex-col">
      {/* Fraud Incidence Rate Box */}
      <div className="shadow-lg">
        <div className="bg-[#243461] shadow-inner-custom p-6 rounded-lg text-center mb-6">
          <h2 className="text-2xl tracking-wider text-white mb-2">
            FRAUD INCIDENCE RATE
          </h2>
          {/* Use data from JSON */}
          <p className="text-5xl text-red-600">
            {fraudDataState.fraud_metrics.incident_rate}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full border-t border-gray-700 mb-6"></div>

      {/* Common Fraudulent Patterns */}
      <div className="flex-grow">
        <h3 className="text-lg font-bold mb-4 font-mulish">
          COMMON FRAUDULENT PATTERNS
        </h3>
        <ul className="space-y-4">
          {/* Map over data from JSON */}
          {Object.entries(fraudDataState.fraud_metrics.common_patterns).map(
            ([pattern, percentage], index) => (
              <li key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl text-white">{percentage}</span>
                  {/* Removed trailing dot from pattern text if present in JSON */}
                  <span className="text-gray-400 uppercase text-sm font-mulish">
                    {pattern.endsWith(".") ? pattern.slice(0, -1) : pattern}
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
