"use client";

import TableSkeleton from "@/components/ui/tableSkeleton";
import React, { useEffect, useState } from "react";

export default function CompetitivePositioning() {
  const [scores, setScores] = useState<{ [key: string]: string[] }>({});
  const [prices, setPrices] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const res = await fetch("/api/market-data");
        if (!res.ok) throw new Error("Failed to fetch market data");
        const data = await res.json();

        const cp = data?.competitive_positioning;
        const pc = data?.pricing_comparison;

        if (cp?.scores && typeof cp.scores === "object") {
          setScores(cp.scores);
        }

        if (pc?.competitors && typeof pc.competitors === "object") {
          setPrices(pc.competitors);
        }

        setError(null);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
  }, []);

  const hasScores = Object.keys(scores).length > 0;
  const hasPrices = Object.keys(prices).length > 0;

  return (
    <div className="p-8 bg-[#4B65AB] dark:bg-[#1d2328] rounded-lg h-full flex flex-col shadow-inner-custom2">
      <div className="flex items-center justify-between mb-6">
        <div className="font-mulish">
          <h2 className="text-lg font-semibold text-white">
            Competitive Positioning
          </h2>
        </div>
      </div>

      {loading ? (
        <TableSkeleton columns={5} />
      ) : error ? (
        <div className="text-xs text-center text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto flex-grow text-[0.6rem] text-left font-mulish">
          <table className="w-full text-white">
            <thead>
              <tr className="text-white/70 uppercase border-b-[1px] border-white/20 dark:border-[#56577A]">
                <th className="py-1">Name</th>
                <th className="text-center py-1">Market Share</th>
                <th className="text-center py-1">Price</th>
                <th className="text-center py-1">Satisfaction</th>
                <th className="text-center py-1">Innovation</th>
              </tr>
            </thead>
            <tbody className="text-white">
              {hasScores && hasPrices ? (
                Object.entries(scores).map(([name, scoreArray]) => {
                  const priceString = prices[name];
                  const priceValue = priceString?.match(/\d+/)?.[0] ?? "N/A";

                  const marketShare = scoreArray?.[1] ?? "N/A";
                  const satisfaction = scoreArray?.[2] ?? "N/A";
                  const innovation = scoreArray?.[3] ?? "N/A";

                  return (
                    <tr
                      key={name}
                      className="hover:bg-white/10 dark:hover:bg-gray-800/50 border-b-[1px] border-white/20 dark:border-[#56577A]"
                    >
                      <td className="py-5 font-medium">{name}</td>
                      <td className="text-center py-5">{marketShare}</td>
                      <td className="text-center py-5">${priceValue}</td>
                      <td className="text-center py-5">{satisfaction}</td>
                      <td className="text-center py-5">{innovation}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-5 text-gray-200">
                    No competitive positioning data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
