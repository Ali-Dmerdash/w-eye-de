"use client";

import LoadingSpinner from "@/components/ui/loadingSpinner";
import React, { useEffect, useState } from "react";

export default function Threats() {
  const [threats, setThreats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchThreats = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/market/results");
        if (!res.ok) throw new Error(`${res.statusText} ${res.status}`);
        const data = await res.json();

        const swot = data?.[0]?.swot_analysis;
        if (Array.isArray(swot?.threats)) {
          setThreats(swot.threats);
        }

        setError(null);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchThreats();
  }, []);

  const hasThreats = threats.length > 0;
  const threatText = hasThreats ? threats[0] : "No threats data available.";
  const threatSource = hasThreats && threats.length > 1 ? threats[1] : null;

  return (
    <div className="bg-[#1d2328] text-white font-bayon p-6 rounded-lg h-full flex flex-col text-center justify-center items-center shadow-inner-custom2">
      <span className="text-3xl text-orange-500 mb-2 font-bayon">Threats</span>

      {loading ? (
        <>
          <LoadingSpinner />
        </>
      ) : error ? (
        <span className="text-xs font-mulish text-red-400">{error}</span>
      ) : hasThreats ? (
        <>
          <div className="break-words leading-tight max-w-full">
            <span className="text-xs font-mulish">{threatText}</span>
          </div>
          {threatSource && (
            <span className="text-[0.50rem] font-mulish text-gray-400 mt-1">
              {threatSource}
            </span>
          )}
        </>
      ) : (
        <span className="text-xs font-mulish text-gray-400">{threatText}</span>
      )}
    </div>
  );
}
