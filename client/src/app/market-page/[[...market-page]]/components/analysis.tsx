"use client";

const marketForecast = [
  {
    id: 1,
    swot_analysis: {
      strengths: [
        "Strong brand recognition",
        "(Source: Market Analysis - Excerpt)"
      ],
      weaknesses: [
        "High competition",
        "(Source: Competitor Analysis - Excerpt)"
      ],
      opportunities: [
        "Expansion into emerging markets",
        "(Source: Market Trends - Excerpt)"
      ],
      threats: [
        "Rapid technological changes",
        "(Source: SWOT Analysis - Excerpt)"
      ]
    },
    pricing_comparison: {
      competitors: {
        "Xiaomi": "599 (Source: Pricing Comparison - Excerpt)",
        "Apple": "999 (Source: Pricing Comparison - Excerpt)",
        "Samsung": "799 (Source: Pricing Comparison - Excerpt)"
      },
      discount_strategies: [
        "Price matching",
        "(Source: Competitor Analysis - Excerpt)"
      ]
    },
    competitive_positioning: {
      metrics: [
        "Price",
        "Market Share",
        "Satisfaction",
        "Innovation"
      ],
      scores: {
        "Xiaomi": [
          "8 (Source: Competitive Positioning - Excerpt)",
          "20%",
          "4.5",
          "9"
        ],
        "Apple": [
          "6 (Source: Competitive Positioning - Excerpt)",
          "15%",
          "4.2",
          "7"
        ],
        "Samsung": [
          "7 (Source: Competitive Positioning - Excerpt)",
          "18%",
          "4.3",
          "8"
        ]
      },
      visualization_note: "Radar chart recommended"
    },
    market_analysis: {
      trends: [
        {
          name: "Increased demand for budget smartphones",
          growth: "25% (Source: Market Analysis - Excerpt)",
          impact: "high"
        },
        {
          name: "Growing popularity of mid-range segment",
          growth: "15% (Source: Market Analysis - Excerpt)",
          impact: "medium"
        }
      ],
      market_share: {
        "Xiaomi": "12% (Source: Market Share - Excerpt)",
        "Apple": "25% (Source: Market Share - Excerpt)",
        "Samsung": "20% (Source: Market Share - Excerpt)"
      }
    },
    recommendations: {
      immediate_actions: [
        "Invest in digital marketing",
        "(Source: Competitor Analysis - Excerpt)"
      ],
      strategic_initiatives: [
        "Develop mid-range segment offerings",
        "(Source: Market Trends - Excerpt)"
      ],
      urgent_alerts: [
        "Monitor competitor pricing strategies",
        "(Source: Pricing Comparison - Excerpt)"
      ]
    }
  }
];

export default function Analysis() {
  return (
    <div className="p-4 md:p-6 bg-[#1d2328] rounded-xl w-full shadow-md h-full">
      <div className="mb-4">
        <h2 className="text-white text-xl md:text-2xl text-center font-bayon">
          MARKET ANALYSIS
        </h2>
      </div>

      <div className="max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Trends Section */}
          <div className="pr-3 border-r border-gray-700">
            <h3 className="text-white text-base mb-2 text-center font-bayon">
              Trends
            </h3>
            <div>
              <div className="grid grid-cols-12 gap-2 text-xs text-gray-400 mb-1 px-1 font-mulish">
                <div className="col-span-6">Name</div>
                <div className="col-span-3 text-center">Growth</div>
                <div className="col-span-3 text-center">Impact</div>
              </div>

              {marketForecast.map((response) =>
                response.market_analysis.trends.map((trend, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-700 pb-2 mb-2 last:border-0"
                  >
                    <div className="grid grid-cols-12 gap-2 bg-[#1f252b] p-2 rounded-md border border-slate-800">
                      <div className="col-span-6 text-white text-xs font-mulish">
                        {trend.name}
                      </div>
                      <div className="col-span-3 text-center text-white text-xs font-mulish">
                        {trend.growth}
                      </div>
                      <div className="col-span-3 text-center text-white text-xs font-mulish">
                        {trend.impact}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Market Share Section */}
          <div className="pl-3">
            <h3 className="text-white text-base mb-2 text-center font-bayon">
              Market Share
            </h3>
            <div>
              <div className="grid grid-cols-6 gap-2 text-xs text-gray-400 mb-1 px-1 font-mulish">
                <div className="col-span-3">Name</div>
                <div className="col-span-3 text-center">Percentage</div>
              </div>

              {marketForecast.map((response) =>
                Object.entries(response.market_analysis.market_share).map(
                  ([name, percentage], index) => (
                    <div
                      key={index}
                      className="border-b border-gray-700 pb-2 mb-2 last:border-0"
                    >
                      <div className="grid grid-cols-6 gap-2 bg-[#1f252b] p-2 rounded-md border border-slate-800">
                        <div className="col-span-3 text-white text-xs font-mulish">
                          {name}
                        </div>
                        <div className="col-span-3 text-center text-white text-xs font-mulish">
                          {percentage}
                        </div>
                      </div>
                    </div>
                  )
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom scrollbar styles
      <style jsx global>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: rgba(75, 85, 99, 0.5);
          border-radius: 20px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background-color: rgba(75, 85, 99, 0.8);
        }
      `}</style> */}



    </div>
  );
}
