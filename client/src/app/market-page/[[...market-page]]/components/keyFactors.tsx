"use client";

const revForecast = [
  {
    id: 1,
    revenue_forecast: "$1,234,567",
    confidence_level: "High",
    key_factors: {
      SeasonalDemand: "0.3/High",
      EconomicIndicators: "0.5/High",
      MarketingCampaignEffectiveness: "0.2/Medium",

    },
    analysis: {
      insights:
        "Based on historical sales data and current market trends, we expect a significant increase in revenue due to the upcoming holiday season. The effectiveness of our marketing campaigns will also play a crucial role in driving sales.",
      recommendation:
        "Increase marketing budget by 10% to capitalize on seasonal demand, and optimize product offerings to align with consumer preferences.",
    },
  },
];

export default function KeyFactorsCard() {


  return (
    <div className="p-8 bg-[#1d2328] rounded-xl w-full shadow-md">






    </div>
  );
}
