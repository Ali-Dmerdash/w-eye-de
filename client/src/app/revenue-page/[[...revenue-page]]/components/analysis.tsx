import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";



const revForecast = [
  {
    id: 1,
    revenue_forecast: "$1,234,567",
    confidence_level: "High",
    key_factors: {
      SeasonalDemand: "0.3/High",
      MarketingCampaignEffectiveness: "0.2/Medium",
      EconomicIndicators: "0.5/High"
    },
    analysis: {
      insights: "Based on historical sales data and current market trends, we expect a significant increase in revenue due to the upcoming holiday season. The effectiveness of our marketing campaigns will also play a crucial role in driving sales." , 
      recommendation: "Increase marketing budget by 10% to capitalize on seasonal demand, and optimize product offerings to align with consumer preferences."
    }

  }
];
const Analysis = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex items-start justify-center flex-wrap">
      <Card className="w-full bg-primary text-white border-none">
        <CardHeader className="text-center">
          <h2 className="text-4xl font-bayon">Analysis</h2>
        </CardHeader>
        <CardContent>
          {revForecast.map((forecast) => (
            <div
              key={forecast.id}
              className="flex flex-col items-center font-mulish text-gray-400"
            >
              <p className="text-sm">{forecast.analysis.insights}</p>

              <div className="pt-4">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="block text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Recommendation
                </button>

                {isModalOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-[#1D2328] rounded-lg p-6 max-w-md w-full shadow-lg dark:bg-gray-700">
                      <h3 className="text-lg font-semibold text-gray-200 dark:text-white">Model Recommendation</h3>
                      <p className="mt-2 text-sm text-gray-400 dark:text-gray-300">
                        {forecast.analysis.recommendation}
                      </p>
                      <div className="flex justify-end mt-4">
                        <button
                          onClick={() => setIsModalOpen(false)}
                          className="block text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Analysis;
