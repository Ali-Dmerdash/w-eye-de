"use client";
import React from "react"; // Import React
import revenueData from "../revenueData.json"; // Correct path from src/components to src

// Define an interface for the key factors if needed, or use Record<string, string>
interface KeyFactors {
  [key: string]: string; // Assumes keys are strings and values are strings like "0.3/High"
}

const KeyFactorsCard: React.FC = () => {
  // Add React.FC type
  const formatLabel = (label: string): string => {
    // Add type annotation for parameter and return value
    // Convert camelCase or PascalCase to Title Case with spaces, then uppercase
    let result = label.replace(/([A-Z])/g, " $1");
    // Handle potential leading space if first word starts with uppercase
    result = result.replace(/^\s+/, "");
    // Uppercase the whole string as per original requirement
    return result.toUpperCase();
  };

  // Access data directly from the imported JSON object
  const forecast = revenueData;
  // Explicitly type key_factors if necessary, or let TypeScript infer
  const key_factors: KeyFactors = forecast.key_factors as KeyFactors;

  return (
    <div className="p-8 bg-[#1d2328] rounded-xl w-full max-w-md mx-auto shadow-md">
      <h2 className="text-4xl font-bayon text-white text-center mb-6">
        Key Factors
      </h2>

      <div className="grid grid-cols-2 gap-4 text-center">
        {Object.entries(key_factors).map(([key, value], index) => {
          // Ensure value is treated as string before splitting
          const parts = String(value).split("/");
          const score = parts[0] ? parts[0].trim() : "";
          const level = parts[1] ? parts[1].trim() : "";

          const formattedKey = formatLabel(key); // Use the provided key directly
          const factorBox = (
            <div
              key={key}
              className="bg-[#1f252b] border border-slate-800 rounded-lg py-4 px-2 font-bayon shadow-inner-custom-bg"
            >
              <h3 className="text-white text-sm">{formattedKey}</h3>
              <p
                className={`${level === "High"
                    ? "text-red-500"
                    : level === "Medium"
                      ? "text-orange-300"
                      : "text-gray-300"
                  } text-sm`}
              >
                {score} / {level}
              </p>
            </div>
          );

          // Apply col-span-2 to the last item if there's an odd number of items
          if (
            Object.keys(key_factors).length % 2 !== 0 &&
            index === Object.keys(key_factors).length - 1
          ) {
            return (
              <div className="col-span-2" key={key}>
                {factorBox}
              </div>
            );
          }

          return factorBox;
        })}
      </div>
    </div>
  );
};

export default KeyFactorsCard;
