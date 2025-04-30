
"use client"

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

export default function competitivePositioning() {



  return (

    <div className="p-8 bg-[#1d2328] rounded-lg h-full flex flex-col shadow-inner-custom2">
      <div className="flex items-center justify-between mb-6">
        <div className="font-mulish">
          <h2 className="text-lg font-semibold text-white">Competitive Positioning</h2>
        </div>
      </div>

      <div className="overflow-x-auto flex-grow text-[0.6rem] text-left font-mulish">
        <table className="w-full">
          <thead>
            <tr className="text-gray-400 uppercase  border-b-[1px] border-[#56577A]">
              <th className="py-1">Name</th>
              <th className="text-center py-1">Market Share</th>
              <th className="text-center py-1">Price</th>
              <th className="text-center py-1">Satisfaction</th>
              <th className="text-center py-1">Innovation</th>
            </tr>
          </thead>
          <tbody className="text-white">
            {marketForecast.flatMap((response) => {
              const scores = response.competitive_positioning.scores;
              const prices = response.pricing_comparison.competitors;

              return Object.entries(scores).map(([name, scoreArray]) => (
                <tr key={name} className="hover:bg-gray-800/50 border-b-[1px] border-[#56577A]">
                  <td className="py-5 font-medium">{name}</td>
                  <td className="text-center py-5">{scoreArray[1]}</td>
                  <td className="text-center py-5">${prices[name].match(/\d+/)?.[0] ?? "N/A"}</td>
                  <td className="text-center py-5">{scoreArray[2]}</td>
                  <td className="text-center py-5">{scoreArray[3]}</td>
                </tr>
              ));
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

