"use client";

import React, { useEffect, useState } from "react";

export default function Weaknesses() {
  const [weaknesses, setWeaknesses] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeaknesses = async () => {
      try {
        const res = await fetch("/api/market-data");
        if (!res.ok) throw new Error(`${res.statusText} ${res.status}`);
        const data = await res.json();

        const swot = data?.swot_analysis;
        if (Array.isArray(swot?.weaknesses)) {
          setWeaknesses(swot.weaknesses);
        }

        setError(null);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchWeaknesses();
  }, []);

  const hasWeaknesses = weaknesses.length > 0;
  const weaknessText = hasWeaknesses ? weaknesses[0] : "No weaknesses data available.";
  const weaknessSource = hasWeaknesses && weaknesses.length > 1 ? weaknesses[1] : null;

  return (
    <div className="bg-[#1d2328] text-white font-bayon p-6 rounded-lg h-full flex flex-col text-center justify-center items-center shadow-inner-custom2">
      <span className="text-3xl text-red-500 mb-2">Weaknesses</span>

      {loading ? (
        <span className="text-xs font-mulish text-gray-400">Loading...</span>
      ) : error ? (
        <span className="text-xs font-mulish text-red-400">{error}</span>
      ) : hasWeaknesses ? (
        <>
          <div className="break-words leading-tight max-w-full">
            <span className="text-xs font-mulish">{weaknessText}</span>
          </div>
          {weaknessSource && (
            <span className="text-[0.50rem] font-mulish text-gray-400 mt-1">
              {weaknessSource}
            </span>
          )}
        </>
      ) : (
        <span className="text-xs font-mulish text-gray-400">{weaknessText}</span>
      )}
    </div>
  );
}
