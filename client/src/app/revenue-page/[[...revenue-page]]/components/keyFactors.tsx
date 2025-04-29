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
  const formatLabel = (label: string) => {
    return label.replace(/([a-z])([A-Z])/g, "$1 $2").toUpperCase();
  };

  return (
    <div className="p-8 bg-[#1d2328] rounded-xl w-full max-w-md mx-auto shadow-md">


      {revForecast.map((forecast) => {
        const { key_factors } = forecast;

        return (
          <div key={forecast.id}>
            <h2 className="text-4xl font-bayon text-white text-center mb-6">
              Key Factors
            </h2>

            <div className="grid grid-cols-2 gap-4 text-center">
              {Object.entries(key_factors).map(([key, value], index) => {
                const [score, level] = value.split("/");
                const formattedKey = formatLabel(key);
                const factorBox = (
                  <div
                    key={key}
                    className="bg-[#1f252b] border border-slate-800 rounded-lg py-4 px-2 font-bayon shadow-inner-custom-bg"
                  >
                    <h3 className="text-white text-sm">
                      {formattedKey}
                    </h3>
                    <p className={`${level === "High"
                        ? "text-red-500"
                        : level === "Medium"
                          ? "text-orange-300"
                          : "text-gray-300"
                      } text-sm`}>
                      {score.trim()} / {level.trim()}
                    </p>
                  </div>
                );

                if (index === 2) {
                  return (
                    <div className="col-span-2" key={key}>
                      {factorBox}
                    </div>
                  );
                }

                return factorBox;
              })}
            </div>
          </div>
        );
      })}



    </div>
  );
}
