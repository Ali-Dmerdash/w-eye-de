"use client";
import TableSkeleton from "@/components/ui/tableSkeleton";
import React, { useEffect, useState } from "react";

export default function PricingComparison() {
  const [competitors, setCompetitors] = useState<{ [key: string]: string }>({});
  const [discountStrategies, setDiscountStrategies] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/market/results");
        if (!res.ok) throw new Error(`${res.statusText} ${res.status}`);
        const data = await res.json();

        const pc = data?.[0]?.pricing_comparison;
        if (pc?.competitors && typeof pc.competitors === "object") {
          setCompetitors(pc.competitors);
        }

        if (Array.isArray(pc?.discount_strategies)) {
          setDiscountStrategies(pc.discount_strategies);
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

  const hasCompetitors = Object.keys(competitors).length > 0;
  const firstDiscountStrategy = discountStrategies[0] || "N/A";

  return (
    <div className="p-8 bg-[#1d2328] rounded-lg h-full flex flex-col shadow-inner-custom2">
      <div className="flex items-center justify-between mb-6">
        <div className="font-mulish">
          <h2 className="text-lg font-semibold text-white">
            Pricing Comparison
          </h2>
          <p className="text-sm text-emerald-500">
            {hasCompetitors
              ? `${Object.keys(competitors).length} Competitor${
                  Object.keys(competitors).length > 1 ? "s are" : " is"
                } available`
              : "No competitors available"}
          </p>
        </div>
      </div>

      {loading ? (
        <TableSkeleton columns={3} />
      ) : error ? (
        <div className="text-xs text-center text-red-400">{error}</div>
      ) : (
        <div className="overflow-x-auto flex-grow text-xs text-left font-mulish">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-400 uppercase border-b-[1px] border-[#56577A]">
                <th className="py-3">Name</th>
                <th className="text-center py-3">Price</th>
                <th className="text-center py-3">Discount Strategies</th>
              </tr>
            </thead>
            <tbody className="text-white">
              {hasCompetitors ? (
                Object.entries(competitors).map(([name, priceString]) => {
                  const priceValue = priceString?.match(/\d+/)?.[0] ?? "N/A";
                  return (
                    <tr
                      key={name}
                      className="hover:bg-gray-800/50 border-b-[1px] border-[#56577A]"
                    >
                      <td className="py-5 font-medium">{name}</td>
                      <td className="text-center py-5">${priceValue}</td>
                      <td className="text-center py-5">
                        {firstDiscountStrategy}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={3} className="text-center py-5 text-gray-400">
                    No pricing comparison data available.
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
