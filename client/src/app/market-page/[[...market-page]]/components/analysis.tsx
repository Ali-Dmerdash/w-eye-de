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
    <div className="p-4 md:p-6 bg-[#1d2328] rounded-xl w-full h-[40vh] overflow-y-auto custom-scrollbar shadow-inner-custom2">
      <div className="">
        <h2 className="text-white text-xl md:text-2xl text-center font-bayon">
          MARKET ANALYSIS
        </h2>
      </div>

      <div className="pt-5 md:pt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="pr-1">
            <h3 className="text-white text-base mb-2 text-center font-mulish">
              Trends
            </h3>
            <table className="w-full text-xs font-mulish text-white">
              <thead>
                <tr className="text-gray-400 text-left border-b-[1px]  border-[#56577A]">
                  <th className="py-3">Name</th>
                  <th className="py-3 text-center">Growth</th>
                  <th className="py-3 text-center">Impact</th>
                </tr>
              </thead>
              <tbody>
                {marketForecast.map((response) =>
                  response.market_analysis.trends.map((trend, index) => (
                    <tr
                      key={index}
                      className="border-b-[1px]  border-[#56577A] hover:bg-gray-800/50"
                    >
                      <td className="py-5">{trend.name}</td>
                      <td className="py-5 text-center">
                        {trend.growth.match(/\d+/)?.[0]}%
                      </td>
                      <td className="py-5 text-center capitalize">{trend.impact}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="md:pl-3 md:border-l md:border-gray-700 pt-5 md:pt-0">
            <h3 className="text-white text-base mb-2 text-center font-mulish">
              Market Share
            </h3>
            <table className="w-full text-xs font-mulish text-white">
              <thead>
                <tr className="text-gray-400 text-left border-b-[1px]  border-[#56577A]">
                  <th className="py-3">Name</th>
                  <th className="py-3 pe-2 text-end">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {marketForecast.map((response) =>
                  Object.entries(response.market_analysis.market_share).map(
                    ([name, percentage], index) => (
                      <tr
                        key={index}
                        className="border-b-[1px] border-[#56577A] hover:bg-gray-800/50"
                      >
                        <td className="py-3.5">{name}</td>
                        <td className="py-3.5 pe-2 text-end">
                          {percentage.match(/\d+/)?.[0]}%
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
