"use client";

import LoadingSpinner from "@/components/ui/loadingSpinner";
import React, { useEffect, useState } from "react";

export default function Strengths() {
  const [strengths, setStrengths] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStrengths = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/market/results");
        if (!res.ok) throw new Error(`${res.statusText} ${res.status}`);
        const data = await res.json();

        const swot = data?.[0]?.swot_analysis;
        if (Array.isArray(swot?.strengths)) {
          setStrengths(swot.strengths);
        }

        setError(null);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchStrengths();
  }, []);

  const hasStrengths = strengths.length > 0;
  const strengthText = hasStrengths
    ? strengths[0]
    : "No strengths data available.";
  const strengthSource =
    hasStrengths && strengths.length > 1 ? strengths[1] : null;

  return (
    <div className="bg-[#4B65AB] dark:bg-[#1d2328] text-white font-bayon p-6 rounded-lg h-full flex flex-col text-center justify-center items-center shadow-inner-custom2">
      <span className="text-3xl text-green-500 mb-2">Strengths</span>

      {loading ? <>
        <LoadingSpinner />
      </> : error ? (
        <span className="text-xs font-mulish text-red-400">{error}</span>
      ) : hasStrengths ? (
        <>
          <div className="break-words leading-tight max-w-full">
            <span className="text-xs font-mulish">{strengthText}</span>
          </div>
          {strengthSource && (
            <span className="text-[0.50rem] font-mulish text-gray-400 mt-1">
              {strengthSource}
            </span>
          )}
        </>
      ) : (
        <span className="text-xs font-mulish text-gray-400">{strengthText}</span>
      )}
    </div>
  );
}
