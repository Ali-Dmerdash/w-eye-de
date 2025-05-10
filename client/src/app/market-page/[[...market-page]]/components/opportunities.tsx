"use client";

import LoadingSpinner from "@/components/ui/loadingSpinner";
import React, { useEffect, useState } from "react";

export default function Opportunities() {
  const [opportunities, setOpportunities] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/market-data");
        if (!res.ok) throw new Error(`${res.statusText} ${res.status}`);
        const data = await res.json();

        const opps = data?.swot_analysis?.opportunities || null;
        setOpportunities(Array.isArray(opps) ? opps : null);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const opportunityText =
    opportunities && opportunities.length > 0
      ? opportunities[0]
      : "No opportunities data available.";

  const opportunitySource =
    opportunities && opportunities.length > 1 ? opportunities[1] : null;

  return (
    <div className="bg-[#4B65AB] dark:bg-[#1d2328] text-white font-bayon p-6 rounded-lg h-full flex flex-col text-center justify-center items-center shadow-inner-custom2">
      <span className="text-3xl text-yellow-500 mb-2">Opportunities</span>

      {loading ? <>
        <LoadingSpinner />
      </> : error ? (
        <span className="text-xs font-mulish text-red-400">{error}</span>
      ) : (
        <>
          <div className="break-words leading-tight max-w-full">
            <span className="text-xs font-mulish">{opportunityText}</span>
          </div>
          {opportunitySource && (
            <span className="text-[0.50rem] font-mulish text-gray-400 mt-1">
              {opportunitySource}
            </span>
          )}
        </>
      )}
    </div>
  );
}
