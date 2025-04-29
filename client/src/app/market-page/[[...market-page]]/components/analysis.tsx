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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="pr-3 border-r border-gray-700">
            <h3 className="text-white text-base mb-2 text-center font-mulish">
              Trends
            </h3>
            <table className="w-full text-xs font-mulish text-white border-separate border-spacing-y-2">
              <thead>
                <tr className="text-gray-400 text-left">
                  <th className="px-2 py-1">Name</th>
                  <th className="px-2 py-1 text-center">Growth</th>
                  <th className="px-2 py-1 text-center">Impact</th>
                </tr>
              </thead>
              <tbody>
                {marketForecast.map((response) =>
                  response.market_analysis.trends.map((trend, index) => (
                    <tr
                      key={index}
                      className="bg-[#1f252b] rounded-md border border-slate-800"
                    >
                      <td className="px-2 py-1">{trend.name}</td>
                      <td className="px-2 py-1 text-center">{trend.growth}</td>
                      <td className="px-2 py-1 text-center">{trend.impact}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="pl-3">
            <h3 className="text-white text-base mb-2 text-center font-mulish">
              Market Share
            </h3>
            <table className="w-full text-xs font-mulish text-white border-separate border-spacing-y-2">
              <thead>
                <tr className="text-gray-400 text-left">
                  <th className="px-2 py-1">Name</th>
                  <th className="px-2 py-1 text-center">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {marketForecast.map((response) =>
                  Object.entries(response.market_analysis.market_share).map(
                    ([name, percentage], index) => (
                      <tr
                        key={index}
                        className="bg-[#1f252b] rounded-md border border-slate-800"
                      >
                        <td className="px-2 py-1">{name}</td>
                        <td className="px-2 py-1 text-center">
                          {percentage}
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
