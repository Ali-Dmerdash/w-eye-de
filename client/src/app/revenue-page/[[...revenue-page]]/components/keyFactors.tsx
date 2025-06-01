"use client";
import React from "react";
// Removed Redux hook import
import { RevenueKeyFactors } from "@/state/type"; // Keep type import
// Removed LoadingSpinner import as parent handles loading

// Define props for KeyFactorsCard
interface KeyFactorsCardProps {
  keyFactorsData: RevenueKeyFactors | undefined | null;
}

const KeyFactorsCard: React.FC<KeyFactorsCardProps> = ({ keyFactorsData }) => {
  // Removed Redux hook call
  // Removed local useState for keyFactorsState, isLoading, error

  const formatLabel = (label: string): string => {
    let result = label.replace(/([A-Z])/g, " $1");
    result = result.replace(/^\s+/, "");
    return result.toUpperCase();
  };

  // Loading and error handling will now be done in the parent component (page.tsx)

  if (!keyFactorsData) {
    // Render a minimal state or rely on parent's handling.
    return (
      <div className="p-8 bg-[#4B65AB] dark:bg-[#1d2328] rounded-xl w-full max-w-md mx-auto shadow-md">
        <h2 className="text-4xl font-bayon text-white text-center mb-6">
          Key Factors
        </h2>
        <div className="grid grid-cols-2 gap-4 text-center">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="bg-[#AEC3FF]/50 dark:bg-[#1f252b] border border-slate-500 dark:border-slate-800 rounded-lg py-4 px-2 font-bayon shadow-inner-custom-bg"
            >
              <div className="h-4 bg-[#AEC3FF]/50 rounded w-24 mx-auto mb-4 pulse" />
              <div className="h-4 bg-[#AEC3FF]/50 rounded w-20 mx-auto pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const entries = Object.entries(keyFactorsData);

  return (
    <div className="p-8 bg-[#4B65AB] dark:bg-[#1d2328] rounded-xl w-full mx-auto shadow-md">
      <h2 className="text-4xl font-bayon text-white text-center mb-6">
        Key Factors
      </h2>

      <div className="grid grid-cols-2 gap-4 text-center">
        {entries.map(([key, value], index) => {
          const [score = "", level = ""] = value
            .split("/")
            .map((s) => s.trim());
          const formattedKey = formatLabel(key);

          const factorBox = (
            <div
              key={key}
              className="dark:bg-[#1f252b] bg-[#AEC3FF]/50 border dark:border-slate-800 border-slate-500 rounded-lg py-4 px-2 font-bayon shadow-inner-custom-bg"
            >
              <h3 className="text-white text-sm">{formattedKey}</h3>
              <p
                className={`${
                  level === "High"
                    ? "dark:text-red-500 text-red-700"
                    : level === "Medium"
                    ? "text-orange-300"
                    : "text-gray-300"
                } text-sm`}
              >
                {score} / {level}
              </p>
            </div>
          );

          // Handle odd number of entries - make last one full width
          if (entries.length % 2 !== 0 && index === entries.length - 1) {
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
