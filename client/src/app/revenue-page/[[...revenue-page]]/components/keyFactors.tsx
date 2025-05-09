"use client";
import React, { useState, useEffect } from "react";

interface KeyFactors {
  [key: string]: string; // e.g., "Seasonal Demand": "0.3/High"
}

interface RevenueData {
  key_factors: KeyFactors;
}

const KeyFactorsCard: React.FC = () => {
  const [keyFactorsState, setKeyFactorsState] = useState<KeyFactors | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatLabel = (label: string): string => {
    let result = label.replace(/([A-Z])/g, " $1");
    result = result.replace(/^\s+/, "");
    return result.toUpperCase();
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/revenue-data");
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data: RevenueData = await response.json();
        setKeyFactorsState(data.key_factors);
      } catch (e: any) {
        console.error("Failed to fetch key factors data:", e);
        setError(e.message || "Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading)
    return (
      <div className="p-8 bg-[#1d2328] rounded-xl w-full max-w-md mx-auto shadow-md">
        <h2 className="text-4xl font-bayon text-white text-center mb-6">
          Key Factors
        </h2>
        <div className="grid grid-cols-2 gap-4 text-center">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="bg-[#1f252b] border border-slate-800 rounded-lg py-4 px-2 font-bayon shadow-inner-custom-bg"
            >
              <div className="h-4 bg-gray-700 rounded w-24 mx-auto mb-4 pulse" />
              <div className="h-4 bg-gray-700 rounded w-20 mx-auto pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  if (error)
    return (
      <div className="text-red-500 p-6 bg-[#1d2328] rounded-lg h-full flex items-center justify-center">
        Error: {error}
      </div>
    );
  if (!keyFactorsState)
    return (
      <div className="text-white p-6 bg-[#1d2328] rounded-lg h-full flex items-center justify-center">
        No key factors data available.
      </div>
    );

  const entries = Object.entries(keyFactorsState);

  return (
    <div className="p-8 bg-[#1d2328] rounded-xl w-full max-w-md mx-auto shadow-md">
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
